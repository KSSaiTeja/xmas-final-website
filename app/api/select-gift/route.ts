/* eslint-disable prefer-const */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateSheet } from "@/lib/googleSheets";

const offers = [
  { discount: 2000, probability: 0.4 },
  { discount: 2500, probability: 0.2 },
  { discount: 1000, probability: 0.2 },
  { discount: 500, probability: 0.2 },
];

const calculateProbability = async () => {
  const [totalEntries, entriesWith2000] = await Promise.all([
    prisma.christmasEntry.count(),
    prisma.christmasEntry.count({ where: { gift: "₹2000" } }),
  ]);
  return entriesWith2000 / totalEntries < 0.4;
};

export async function POST(request: Request) {
  try {
    const { entryId } = await request.json();

    const entry = await prisma.christmasEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (entry.gift) {
      return NextResponse.json({ gift: entry.gift });
    }

    const shouldOffer2000 = await calculateProbability();
    let selectedOffer;
    selectedOffer =
      shouldOffer2000 && Math.random() < 0.5
        ? offers[0]
        : offers[Math.floor(Math.random() * 3) + 1];

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().split(" ")[0];

    const [updatedEntry] = await Promise.all([
      prisma.christmasEntry.update({
        where: { id: entryId },
        data: { gift: `₹${selectedOffer.discount}` },
      }),
      updateSheet(entry.email, {
        offer: `₹${selectedOffer.discount}`,
        time: formattedTime,
        date: formattedDate,
      }),
    ]);

    return NextResponse.json({ gift: updatedEntry.gift });
  } catch (error) {
    console.error("Error selecting gift:", error);
    return NextResponse.json(
      { error: "An error occurred while selecting the gift" },
      { status: 500 },
    );
  }
}
