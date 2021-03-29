import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Block } from "./block.model";

const BACKEND_URL = environment.apiUrl + "/blocks/";

@Injectable({ providedIn: "root" })
export class BlockchainService {
  private blocks: Block[] = [];
  public blocksUpdated = new Subject<{ blocks: Block[]; blockCount: number }>();
  logout = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getBlocks() {
    this.http
      .get<{ blocks: any; maxBlocks: number }>(BACKEND_URL + localStorage.getItem("userId"))
      .pipe(
        map(blockData => {
          return {
            blocks: blockData.blocks.map(block => {
              return {
                index: +block.index,
                previousHash: block.previousHash,
                id: block._id,
                timestamp: block.timestamp,
                creator: block.creator,
                data: block.data,
                hash: block.hash,
                nonce: block.nonce
              };
            }),
            maxBlocks: blockData.maxBlocks
          };
        })
      )
      .subscribe(transformedBlockData => {
        this.blocks = transformedBlockData.blocks;
        this.blocksUpdated.next({
          blocks: [...this.blocks],
          blockCount: transformedBlockData.maxBlocks
        });
      });
  }

  getBlocksFromStartToEnd(start, end){
    let searchParams = new HttpParams();
    searchParams = searchParams.append('start', start);
    searchParams = searchParams.append('end', end);
    return this.http.get<{block: any;}>(BACKEND_URL + "block_range",
    {
      params: searchParams
    }).pipe(map(res=>{
      return res.block.map(block=>{
        return {
          id: block._id,
          timestamp: block.timestamp,
          creator: block.creator,
          data: block.data,
          hash: block.hash,
          nonce: block.nonce,
          index: +block.index,
          previousHash: res.block.previousHash
        };
      })
    }));
  }

  getLatestBlock() {
    return this.http.get<{block: any;}>(BACKEND_URL + "block");
  }

  addBlock(index: number, previousHash: string, timestamp: number, data: string, hash: string, nonce: number) {
    const blockData = {index, previousHash, timestamp, data, hash, nonce};
    this.http
      .post<{ message: string; block: Block }>(
        BACKEND_URL,
        blockData
      )
      .subscribe(responseData => {
        this.router.navigate(["/blockchain"]);
      });
  }

  replaceBlock(id: string, index: number, previousHash: string, timestamp: number, data: string, hash: string, nonce: number) {
    const blockData = {id, index, previousHash, timestamp, data, hash, nonce};
    this.http
      .put<{ message: string; block: Block }>(
        BACKEND_URL + id,
        blockData
      )
      .subscribe(responseData => {
        this.router.navigate(["/blockchain"]);
      });
  }

  replaceNextHash(id: string, hash: string){
    const blockData = {id, hash};
    this.http
      .put<{ message: string; }>(
        BACKEND_URL + "nextPrev/" + id,
        blockData
      )
      .subscribe(responseData => {
        this.router.navigate(["/blockchain"]);
      });
  }

}
