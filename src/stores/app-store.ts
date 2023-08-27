import { defineStore } from 'pinia';
import { uuid } from 'src/functions';

export const useAppStore = defineStore('app', {
  state: (): State => ({
    decks: [],
    cards: [],
    deckCardsRelations: [],
    tags: [],
  }),
  getters: {
    getCardsInDeck(state: State) {
      return (deckId: Id) =>
        state.deckCardsRelations.find((relation) => relation.deckId === deckId)
          ?.cards ?? [];
    },
    getAvailableCardsForDeck(state: State) {
      return (deckId: Id) => {
        const cardsInDeck = state.deckCardsRelations
          .find((relation) => relation.deckId === deckId)
          ?.cards.map((card) => card.id);
        return state.cards.filter((card) => !cardsInDeck?.includes(card.id));
      };
    },
  },
  actions: {
    createDeck(deck: Partial<Deck>) {
      deck.id = uuid();
      deck.createdAt = new Date();
      this.decks.push(deck as Deck);
      this.deckCardsRelations.push({ deckId: deck.id, cards: [] });
    },
    updateDeck(newDeck: Deck) {
      const deck = this.decks.find((deck) => deck.id === newDeck.id)!;
      deck.name = newDeck.name;
      deck.description = newDeck.description;
      deck.imageUrl = newDeck.imageUrl;
    },
    deleteDeck(id: Id) {
      this.decks = this.decks.filter((deck) => deck.id !== id);
      this.deckCardsRelations = this.deckCardsRelations.filter(
        (relation) => relation.deckId !== id,
      );
    },
    createCard(card: Partial<Card>) {
      card.id = uuid();
      card.createdAt = new Date();
      this.cards.push(card as Card);
    },
    updateCard(updatedCard: Card) {
      const card = this.cards.find((card) => card.id === updatedCard.id)!;
      card.name = updatedCard.name;
      card.imageUrl = updatedCard.imageUrl;
      card.tags = updatedCard.tags;
      card.description = updatedCard.description;
    },
    addCard(deckId: Id, cardId: Id) {
      const card = this.cards.find((card) => card.id === cardId)!;
      this.deckCardsRelations
        .find((relation) => relation.deckId === deckId)
        ?.cards.push(card);
    },
    deleteCard(id: Id) {
      this.cards = this.cards.filter((card) => card.id !== id);
    },
    removeCardFromDeck(cardId: Id, deckId: Id) {
      const relation = this.deckCardsRelations.find(
        (relation) => relation.deckId == deckId,
      )!;

      relation.cards = relation?.cards.filter((card) => card.id !== cardId);
    },
  },
  persist: true,
});

interface Identity {
  id: Id;
}

export type Id = string;

interface State {
  decks: Deck[];
  cards: Card[];
  deckCardsRelations: DeckCards[];
  tags: string[];
}

type DeckCards = {
  deckId: Id;
  cards: Card[];
};

export type Card = {
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  tags: Array<Tag>;
} & Identity;

export type PlayCard = {
  index: number;
  name: string;
  imageUrl: string;
};

export type Deck = {
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
} & Identity;

export type Tag = {
  name: string;
};

export type Size = 'sm' | 'md' | 'lg';
