import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlockchainService } from '../blockchain.service';

import { SHA256, enc } from "crypto-js";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-blockchain-list',
  templateUrl: './blockchain-list.component.html',
  styleUrls: ['./blockchain-list.component.css']
})
export class BlockchainListComponent implements OnInit, OnDestroy {

  data_msg: string;
  timestamp: Date;
  mine_msg: string;

  blockchain: any[]=[];
  latestBlock;
  difficulty = 3;

  mineClicked: boolean;
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;

  save_clicked: boolean = false;
  chainSubs: Subscription;
  current_block: number;
  inc_index: number;

  constructor(private blockchainService: BlockchainService, private authService: AuthService) { }

  ngOnInit(): void {
    this.blockchainService.logout.next(false);

    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.blockchainService.getBlocks();
    this.chainSubs = this.blockchainService.blocksUpdated.subscribe(response=>{
      this.blockchain = response.blocks;

      for(let block of this.blockchain){
        block.colorPre_hash = 'success';
        block.color_hash = 'success';
        block.hash_changed = false;
      }
      console.log(this.blockchain);
    });
  }

  save_changes(index: number, block: any){
    this.save_clicked = true;
    this.current_block = index;
    this.inc_index = index+1;
    //console.log(this.inc_index); 
    this.mine(block.data);
  }

  onKey(i: number, event: any){
    this.blockchain[-1] = {};
    this.blockchain[-1].color_hash = 'success';

    setTimeout(()=>{
      let current_index = i+1;
      let tempFirst_hash = this.calculateHash(this.blockchain[i].index, this.blockchain[i].previousHash, this.blockchain[i].timestamp, this.blockchain[i].data, this.blockchain[i].nonce);
      this.blockchain[i].color_hash = 'error';
      this.blockchain[i].hash_changed = true;
      this.blockchain[i].hash = tempFirst_hash;
            
      let temp_index = i;
      if(tempFirst_hash.startsWith("000")){
        while(temp_index < (this.blockchain.length)){
          this.blockchain[temp_index].hash_changed = false;
          this.blockchain[temp_index].color_hash = 'success';
          this.blockchain[temp_index].colorPre_hash = 'success';
          temp_index = temp_index+1;
        }
      }else if(this.blockchain[i-1].color_hash === 'error'){
              this.blockchain[i].colorPre_hash = 'error';
            }
            
      let blockchain_length = this.blockchain.length-1;
      while(current_index <= blockchain_length){
        if(!tempFirst_hash.startsWith("000")){
          this.blockchain[current_index].hash_changed = true;
          this.blockchain[current_index].colorPre_hash = 'error';
          this.blockchain[current_index].color_hash = 'error';
        }            
        this.blockchain[current_index].previousHash = this.blockchain[current_index-1].hash;
        let tempSecond_hash = this.calculateHash(this.blockchain[current_index].index, this.blockchain[current_index].previousHash, this.blockchain[current_index].timestamp, this.blockchain[current_index].data, this.blockchain[current_index].nonce);
        this.blockchain[current_index].hash = tempSecond_hash;
        //console.log(tempSecond_hash);
        current_index = current_index+1;
        if(current_index > blockchain_length){
          this.blockchain[i].colorPre_hash = 'success';        
          if(this.blockchain[i-1].color_hash === 'error'){
            this.blockchain[i].colorPre_hash = 'error';
          }
        }
      }
    }, 100);
  }

  calculateHashForBlock(block) {
    const { nextIndex, previousHash, timestamp, data, nonce } = block;
    return this.calculateHash(
      nextIndex,
      previousHash,
      timestamp,
      data,
      nonce
    );
  }

  calculateHash(index, previousHash, timestamp, data, nonce) {
    return SHA256(index + previousHash + timestamp + data + nonce).toString(enc.Hex);
  }

  mine(data) {
    this.mineClicked = true;
    const newBlock = this.generateNextBlock(data);
    try {
      this.addBlock(newBlock);
    } catch(err) {
      throw err;
    }
  }

  generateNextBlock(data) {
    if(this.mineClicked){
      this.latestBlock = this.blockchain[this.blockchain.length-1];
    }
 
    const nextIndex = this.latestBlock.index + 1;
    const previousHash = this.latestBlock.hash;

    let timestamp = new Date().getTime();
    let nonce = 0;
    let nextHash = this.calculateHash(
      nextIndex,
      previousHash,
      timestamp,
      data,
      nonce
    );

    while (!this.isValidHashDifficulty(nextHash)) {
      nonce = nonce + 1;
      timestamp = new Date().getTime();
      nextHash = this.calculateHash(
        nextIndex,
        previousHash,
        timestamp,
        data,
        nonce
      );
    }

    const nextBlock = {
      nextIndex,
      previousHash,
      timestamp,
      data,
      nextHash,
      nonce
    };

    return nextBlock;
  }

  isValidHashDifficulty(hash) {
    for (var i = 0; i < hash.length; i++) {
      if (hash[i] !== "0") {
        break;
      }
    }
    return i >= this.difficulty;
  }

  addBlock(newBlock) {
    if (this.isValidNextBlock(newBlock, this.latestBlock)) {
      if(this.mineClicked && !this.save_clicked){
        this.blockchain.push({index: newBlock.nextIndex, previousHash: newBlock.previousHash, timestamp: newBlock.timestamp, data: newBlock.data, hash: newBlock.nextHash, nonce: newBlock.nonce, colorPre_hash: 'success', color_hash: 'success'});
        this.blockchainService.addBlock(newBlock.nextIndex, newBlock.previousHash, newBlock.timestamp, newBlock.data, newBlock.nextHash, newBlock.nonce);
        this.mineClicked = false;
        setTimeout(()=>{
          this.blockchainService.getLatestBlock().subscribe(block=>{
            this.blockchain[this.blockchain.length-1].id=block.block._id;
          });
        }, 100);
      }else{
        let inc_index = this.current_block;
        while(inc_index < this.blockchain.length){  
          let tempSecond_hash = this.calculateHash(this.blockchain[inc_index].index, this.blockchain[inc_index].previousHash, this.blockchain[inc_index].timestamp, this.blockchain[inc_index].data, this.blockchain[inc_index].nonce);
          if(inc_index == this.current_block){
            this.blockchain[inc_index].hash = tempSecond_hash;
          }else{
            this.blockchain[inc_index].previousHash = this.blockchain[inc_index-1].hash;
            this.blockchain[inc_index].hash = tempSecond_hash;
          }
          inc_index = inc_index+1;
        }
        //this.blockchain[this.current_block].hash = newBlock.nextHash;
        if(!(this.inc_index == this.blockchain.length)){
          this.blockchain[this.inc_index].previousHash = newBlock.nextHash;
        }
        this.blockchain[this.current_block] = {id: this.blockchain[this.current_block].id, index: newBlock.nextIndex, previousHash: this.blockchain[this.current_block-1].hash ? this.blockchain[this.current_block-1].hash : "0", timestamp: newBlock.timestamp, data: newBlock.data, hash: newBlock.nextHash, nonce: newBlock.nonce, colorPre_hash: 'success', color_hash: 'success'};
        
        if(this.blockchain[this.current_block].hash.startsWith("000")){
          this.blockchain[this.current_block].color_hash = 'success';
          if(!(this.inc_index == this.blockchain.length)){
            this.blockchain[this.inc_index].colorPre_hash = 'success';
          }
        }
        if(!this.blockchain[this.current_block].hash.startsWith("000")){
          this.blockchain[this.current_block].color_hash = 'error';
          if(!(this.inc_index == this.blockchain.length)){
            this.blockchain[this.inc_index].colorPre_hash = 'error';
          }
        }
        if(!(this.inc_index == this.blockchain.length)){
          if(!this.blockchain[this.inc_index].hash.startsWith("000")){
            this.blockchain[this.inc_index].color_hash = 'error';
            if((this.inc_index+1) !== (this.blockchain.length)){
              this.blockchain[this.inc_index+1].colorPre_hash = 'error';
            }        
            this.blockchain[this.inc_index].hash_changed = true;
          }
        }
        if(this.blockchain[this.current_block-1].color_hash == 'error'){
          this.blockchain[this.current_block].colorPre_hash = 'error';
        }

        this.blockchainService.replaceBlock(this.blockchain[this.current_block].id, newBlock.nextIndex, this.blockchain[this.current_block-1].hash, newBlock.timestamp, newBlock.data, newBlock.nextHash, newBlock.nonce);  
        this.blockchain[this.current_block].hash_changed = false;
        this.save_clicked = false;
        if(!(this.inc_index == this.blockchain.length)){
          this.blockchainService.replaceNextHash(this.blockchain[this.inc_index].id, newBlock.nextHash);
        }
      }
    } else {
      throw "Error: Invalid block";
    }
  }

  isValidNextBlock(nextBlock, previousBlock) {
    const nextBlockHash = this.calculateHashForBlock(nextBlock);

    if (previousBlock.index + 1 !== nextBlock.nextIndex) {
      return false;
    } else if (previousBlock.hash !== nextBlock.previousHash) {
      return false;
    } else if (nextBlockHash !== nextBlock.nextHash) {
      return false;
    } else if (!this.isValidHashDifficulty(nextBlockHash)) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(){
    this.chainSubs.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
