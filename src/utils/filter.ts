import { config } from "../models/config";

class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  fail: TrieNode | null;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.fail = null;
  }
}

class AhoCorasick {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  addWord(word: string): void {
    let currentNode = this.root;
    for (const char of word) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode());
      }
      currentNode = currentNode.children.get(char)!;
    }
    currentNode.isEndOfWord = true;
  }

  addWords(words: string[]): void {
    for (const word of words) {
      this.addWord(word);
    }
    this.buildFailurePointers();
  }

  buildFailurePointers(): void {
    const queue: Array<TrieNode> = [];

    for (let child of Array.from(this.root.children.values())) {
      child.fail = this.root;
      queue.push(child);
    }

    while (queue.length > 0) {
      const current = queue.shift()!;

      for (let [char, child] of Array.from(current.children)) {
        queue.push(child);

        let failState = current.fail!;
        while (failState !== null && !failState.children.has(char)) {
          failState = failState.fail!;
        }

        child.fail =
          failState === null ? this.root : failState.children.get(char)!;
      }
    }
  }

  check(text: string): boolean {
    let node = this.root;

    for (const char of text) {
      // Handle wildcard '&'
      while (
        node !== null &&
        !node.children.has(char) &&
        !node.children.has("&")
      ) {
        node = node.fail!; // Follow failure pointer
      }

      if (node === null) {
        node = this.root;
        continue;
      }

      // Check both actual character and wildcard '&'
      let nextNodeByChar = node.children.get(char);
      let nextNodeByWildcard = node.children.get("&");

      if (
        (nextNodeByChar && nextNodeByChar.isEndOfWord) ||
        (nextNodeByWildcard && nextNodeByWildcard.isEndOfWord)
      ) {
        return true;
      }

      // Move to the next possible nodes
      node = nextNodeByChar
        ? nextNodeByChar
        : nextNodeByWildcard
        ? nextNodeByWildcard
        : this.root;

      // Check failure links for end-of-word marks
      let tempNode = node.fail;
      while (tempNode !== null) {
        if (tempNode.isEndOfWord) {
          return true;
        }
        tempNode = tempNode.fail;
      }
    }

    return false;
  }

  replace(text: string, replacement: string): string {
    let node = this.root;
    let output = [];
    let startIndex = 0;

    for (let i = 0; i < text.length; i++) {
      while (node !== null && !node.children.has(text[i])) {
        node = node.fail!;
      }

      if (node === null) {
        node = this.root;
        output.push(text[startIndex++]);
        i = startIndex - 1;
      } else {
        node = node.children.get(text[i])!;

        if (node.isEndOfWord) {
          const wordLength = i - startIndex + 1;
          output.splice(-wordLength);
          output.push(replacement);
          startIndex = i + 1;
        }
      }
    }

    return output.join("") + text.slice(startIndex);
  }
}

export interface FilterFile {
  banned: string[];
}

export class Filter {
  private AC: AhoCorasick;

  constructor() {
    this.AC = new AhoCorasick();
  }

  async loadWords(wordfile: string): Promise<void> {
    const file = await Bun.file(wordfile);
    const words = (await file.json()) as FilterFile;
    this.AC.addWords(words.banned);
  }

  check(text: string) {
    return this.AC.check(text.toLowerCase());
  }

  detoxify(text: string) {
    return this.AC.replace(text, "*");
  }
}

export const filter = new Filter();

export const loadFilter = async () => {
  await filter.loadWords(config.filter.file);
};
