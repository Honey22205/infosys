import { EventEmitter } from 'events';

interface VideoCallOptions {
  roomId: string;
  userId: string;
  onStream?: (stream: MediaStream) => void;
  onError?: (error: Error) => void;
}

interface VideoCallConfig {
  signalServer: string;
  iceServers: RTCIceServer[];
}

class VideoCallService extends EventEmitter {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private signalSocket: WebSocket | null = null;

  constructor(private config: VideoCallConfig) {
    super();
  }

  async startCall(): Promise<MediaStream> {
    try {
      // Get local media stream
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Create peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: this.config.iceServers
      });

      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.localStream && this.peerConnection) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      // Set up remote stream handling
      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0];
      };

      // Connect to signaling server
      this.connectToSignalServer();

      return this.localStream;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  private connectToSignalServer() {
    this.signalSocket = new WebSocket(this.config.signalServer);

    this.signalSocket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'offer':
          await this.handleOffer(message.offer);
          break;
        case 'answer':
          await this.handleAnswer(message.answer);
          break;
        case 'ice-candidate':
          await this.handleIceCandidate(message.candidate);
          break;
      }
    };

    this.signalSocket.onopen = () => {
      console.log('Connected to signaling server');
    };

    this.signalSocket.onerror = (error) => {
      console.error('Signaling server error:', error);
    };
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return;

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.sendSignalMessage({
        type: 'answer',
        answer
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return;

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return;

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  private sendSignalMessage(message: any) {
    if (this.signalSocket && this.signalSocket.readyState === WebSocket.OPEN) {
      this.signalSocket.send(JSON.stringify(message));
    }
  }

  async endCall() {
    // Stop all tracks in local stream
    this.localStream?.getTracks().forEach(track => track.stop());

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Close signaling connection
    if (this.signalSocket) {
      this.signalSocket.close();
      this.signalSocket = null;
    }

    this.localStream = null;
    this.remoteStream = null;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
      }
    }
  }

  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
      }
    }
  }
}

export default VideoCallService; 