"use client";

import { useState, useEffect, useRef } from "react";
import { GiftBox } from "./gift-box";
import GiftRevealPopup from "./gift-reveal-popup";

interface Offer {
  id: number;
  discount: number;
  probability: number;
}

const offers: Offer[] = [
  { id: 1, discount: 2000, probability: 0.4 },
  { id: 2, discount: 2500, probability: 0.2 },
  { id: 3, discount: 1000, probability: 0.2 },
  { id: 4, discount: 500, probability: 0.2 },
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function GiftBoxes() {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [shuffledOffers, setShuffledOffers] = useState<typeof offers>([]);
  const [hasSelected, setHasSelected] = useState(false);
  const [selectedBoxPosition, setSelectedBoxPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedOffer = localStorage.getItem("christmasSelectedOffer");
    const storedPosition = localStorage.getItem("christmasSelectedPosition");
    if (storedOffer) {
      setSelectedOffer(storedOffer);
      setHasSelected(true);
      if (storedPosition) {
        setSelectedBoxPosition(JSON.parse(storedPosition));
      }
    } else {
      setShuffledOffers(shuffleArray(offers));
    }
  }, []);

  const handleGiftOpen = (index: number, element: HTMLDivElement) => {
    if (hasSelected) return;

    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.right) / 2 / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const position = { x, y };
    setSelectedBoxPosition(position);
    const offer = shuffledOffers[index];
    const offerString = `₹${offer.discount}`;
    setSelectedOffer(offerString);
    setHasSelected(true);
    localStorage.setItem("christmasSelectedOffer", offerString);
    localStorage.setItem("christmasSelectedPosition", JSON.stringify(position));
  };

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-white text-center mb-20">
        Choose Your Gift!
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20 md:gap-x-20 lg:gap-x-32 justify-items-center">
        {shuffledOffers.map((offer, index) => (
          <div
            key={offer.id}
            className="w-full flex items-center justify-center"
          >
            <GiftBox
              onOpen={(element) => handleGiftOpen(index, element)}
              disabled={hasSelected}
            />
          </div>
        ))}
      </div>
      {selectedOffer && selectedBoxPosition && (
        <GiftRevealPopup
          gift={selectedOffer}
          permanent={true}
          position={selectedBoxPosition}
        />
      )}
    </div>
  );
}
