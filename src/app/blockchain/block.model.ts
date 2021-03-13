export interface Block {
    id:string;
    index: number;
    previousHash: string;
    timestamp: number;
    data: string;
    hash: string;
    nonce: number;
    creator: string;
  }
  