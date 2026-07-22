export interface SelectedImage {
  file: File;
  previewUrl: string;
}

export interface ShareContentInput {
  title: string;
  text?: string;
  url?: string;
}

export interface MapOpenInput {
  address: string;
  url?: string;
}

export interface NetworkStatus {
  online: boolean;
}

export interface PlatformService {
  selectImages(): Promise<SelectedImage[]>;
  shareContent(input: ShareContentInput): Promise<void>;
  openExternalMap(input: MapOpenInput): Promise<void>;
  copyText(value: string): Promise<void>;
  getNetworkStatus(): Promise<NetworkStatus>;
  subscribeNetworkStatus(listener: (status: NetworkStatus) => void): () => void;
}
