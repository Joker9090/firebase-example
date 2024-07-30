// create a singleton to storage data in memory 

import { randomUUID } from "crypto"

export interface globalType {
    memoryData?: memoryData
}
  
export type tokenId = {
    token: string
    user: string
}

class memoryData {
    tokens?: tokenId[]
  
    constructor() {
      if ((global as globalType).memoryData) {
        throw new Error('New instance cannot be created!!')
      } else {
        
      };
      (global as globalType).memoryData = this
    }
  
    getInstance(): this {
      return this
    }

    addToken(token: tokenId) {
        if (!this.tokens) this.tokens = []
        this.tokens.push(token)
    }

    createToken(user: string): tokenId {
        const token = randomUUID();
        this.removeTokenByuserId(user);
        const tokenId: tokenId = { token, user }
        this.addToken(tokenId)
        return tokenId
    }

    removeTokenByuserId(user: string) {
        if (!this.tokens) return
        this.tokens = this.tokens.filter(token => token.user !== user)
    }
    
    checkToken(token: string): tokenId | undefined {
        if (!this.tokens) return undefined
        return this.tokens.find(tokenId => tokenId.token === token)
    }
}

    
let memoryDataSingleton
if (!(global as globalType).memoryData) memoryDataSingleton = new memoryData()
else memoryDataSingleton = (global as globalType).memoryData
export default memoryDataSingleton as memoryData
