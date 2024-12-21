"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Image from "next/image";

interface Position {
  x: number;
  y: number;
}

interface GiftRevealPopupProps {
  gift: string;
  permanent?: boolean;
  position?: Position;
}

const GiftRevealPopup: React.FC<GiftRevealPopupProps> = ({
  gift,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  permanent = false,
  position = { x: 0.5, y: 0.6 },
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: position,
    });
  }, [position]);

  // Extract the amount from the gift string
  const amount = gift.match(/₹(\d+)/)?.[1] || "";

  return useMemo(
    () => (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-gradient-to-b from-white to-gray-50 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-3xl font-bold text-red-600">
                      Congratulations! 🎉
                    </h3>
                    <p className="text-gray-600 mt-2">
                      You&apos;ve unwrapped your special gift
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100"
                  >
                    <div className="text-5xl font-bold text-red-600 mb-2">
                      ₹{amount}
                    </div>
                    <p className="text-xl text-red-800">off on savartx</p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <p className="text-gray-600">
                    Thanks for participating! Our representative will contact
                    you soon.
                  </p>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-600 mb-4">
                      Meanwhile, connect with us:
                    </p>
                    <div className="flex justify-center gap-6">
                      <a
                        href="#"
                        className="opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <Image
                          src="http://awesome-coding.com/theme/images/icons/facebook.png"
                          alt="Facebook"
                          width={32}
                          height={32}
                          className="w-8 h-8"
                        />
                      </a>
                      <a
                        href="#"
                        className="opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <Image
                          src="http://awesome-coding.com/theme/images/icons/twitter.png"
                          alt="Twitter"
                          width={32}
                          height={32}
                          className="w-8 h-8"
                        />
                      </a>
                      <a
                        href="#"
                        className="opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <Image
                          src="http://awesome-coding.com/theme/images/icons/instagram.png"
                          alt="Instagram"
                          width={32}
                          height={32}
                          className="w-8 h-8"
                        />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    ),
    [isOpen, gift, position],
  );
};

export default React.memo(GiftRevealPopup);
