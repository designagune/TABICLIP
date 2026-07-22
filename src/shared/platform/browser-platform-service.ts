import type {
  MapOpenInput,
  NetworkStatus,
  PlatformService,
  SelectedImage,
  ShareContentInput
} from './platform-service';

export class BrowserPlatformService implements PlatformService {
  async selectImages(): Promise<SelectedImage[]> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.multiple = true;

    const files = await new Promise<File[]>((resolve) => {
      input.addEventListener(
        'change',
        () => resolve(Array.from(input.files ?? [])),
        {
          once: true
        }
      );
      input.click();
    });

    return files.map((file) => ({file, previewUrl: URL.createObjectURL(file)}));
  }

  async shareContent(input: ShareContentInput): Promise<void> {
    if (navigator.share) {
      await navigator.share(input);
      return;
    }
    await this.copyText(
      [input.title, input.text, input.url].filter(Boolean).join('\n')
    );
  }

  async openExternalMap(input: MapOpenInput): Promise<void> {
    const target =
      input.url ??
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input.address)}`;
    window.open(target, '_blank', 'noopener,noreferrer');
  }

  async copyText(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
  }

  async getNetworkStatus(): Promise<NetworkStatus> {
    return {online: navigator.onLine};
  }

  subscribeNetworkStatus(
    listener: (status: NetworkStatus) => void
  ): () => void {
    const emit = () => listener({online: navigator.onLine});
    window.addEventListener('online', emit);
    window.addEventListener('offline', emit);
    return () => {
      window.removeEventListener('online', emit);
      window.removeEventListener('offline', emit);
    };
  }
}

export const platformService: PlatformService = new BrowserPlatformService();
