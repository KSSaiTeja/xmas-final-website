import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateSheet } from "@/lib/googleSheets";

const calculateProbability = async () => {
  const [totalEntries, entriesWith2000] = await Promise.all([
    prisma.christmasEntry.count(),
    prisma.christmasEntry.count({ where: { gift: "₹2000" } }),
  ]);
  return entriesWith2000 / totalEntries < 0.4;
};

export async function POST(request: Request) {
  try {
    const { entryId, selectedDiscount } = await request.json();

    const entry = await prisma.christmasEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // If gift already exists, return it
    if (entry.gift) {
      return NextResponse.json({ gift: entry.gift });
    }

    // Determine the final offer
    const shouldOffer2000 = await calculateProbability();
    let finalDiscount;
    if (shouldOffer2000 && Math.random() < 0.5) {
      finalDiscount = 2000;
    } else {
      finalDiscount = selectedDiscount;
    }

    const gift = `₹${finalDiscount}`;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().split(" ")[0];

    // Update both database and sheets with the final offer
    const [updatedEntry] = await Promise.all([
      prisma.christmasEntry.update({
        where: { id: entryId },
        data: { gift },
      }),
      updateSheet(entry.email, {
        offer: gift,
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
