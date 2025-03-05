interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
}

type TranscriptListener = (segment: TranscriptSegment | null) => void;

class TranscriptService {
  private segments: TranscriptSegment[] = [];
  private currentTime: number = 0;
  private listeners: TranscriptListener[] = [];
  private timeOffset: number = 0;

  setTranscript(transcript: string) {
    this.segments = this.parseTranscript(transcript);
    this.timeOffset = 0;
    this.updateListeners();
  }

  private parseTranscript(transcript: string): TranscriptSegment[] {
    return transcript
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const match = line.match(/\[(\d{2}):(\d{2})\](.*)/);
        if (match) {
          const minutes = parseInt(match[1]);
          const seconds = parseInt(match[2]);
          const text = match[3].trim();
          const start = minutes * 60 + seconds;
          const duration = text.length * 0.06 + 2; // Estimate duration based on text length
          return {
            text,
            start,
            end: start + duration
          };
        }
        return null;
      })
      .filter((segment): segment is TranscriptSegment => segment !== null);
  }

  updateTime(time: number) {
    this.currentTime = time;
    const adjustedTime = time + this.timeOffset;
    this.updateListeners();
  }

  private getCurrentSegment(): TranscriptSegment | null {
    return this.segments.find(segment =>
      this.currentTime >= segment.start && this.currentTime <= segment.end
    ) || null;
  }

  private getNextSegment(): TranscriptSegment | null {
    return this.segments.find(segment =>
      this.currentTime < segment.start
    ) || null;
  }

  private getPreviousSegment(): TranscriptSegment | null {
    return [...this.segments]
      .reverse()
      .find(segment => this.currentTime > segment.end) || null;
  }

  addListener(listener: TranscriptListener): () => void {
    this.listeners.push(listener);
    listener(this.getCurrentSegment());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private updateListeners() {
    const currentSegment = this.getCurrentSegment();
    this.listeners.forEach(listener => listener(currentSegment));
  }

  setTimeOffset(offset: number) {
    this.timeOffset = offset;
    this.updateListeners();
  }

  getAllSegments(): TranscriptSegment[] {
    return [...this.segments];
  }
}

export const transcriptService = new TranscriptService(); 