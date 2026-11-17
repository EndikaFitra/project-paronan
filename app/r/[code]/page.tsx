import { notFound } from "next/navigation";

import { AddBillForm } from "@/src/components/room/AddBillForm";
import { BalanceSummary } from "@/src/components/room/BalanceSummary";
import { BillList } from "@/src/components/room/BillList";
import { JoinRoomPanel } from "@/src/components/room/JoinRoomPanel";
import { RememberRoom } from "@/src/components/room/RememberRoom";
import { RoomHeader } from "@/src/components/room/RoomHeader";
import { SettlementPanel } from "@/src/components/room/SettlementPanel";
import { StickyAddBillBar } from "@/src/components/room/StickyAddBillBar";
import { BoardFrame } from "@/src/components/BoardFrame";
import { getAdminCookie, getMemberCookie } from "@/src/lib/cookies";
import { findRoomByCode, toRoomSummary } from "@/src/lib/rooms";

interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;

  const roomRecord = await findRoomByCode(code);
  if (!roomRecord) {
    notFound();
  }

  const room = toRoomSummary(roomRecord);

  const [adminToken, memberCookie] = await Promise.all([
    getAdminCookie(room.id),
    getMemberCookie(room.id),
  ]);
  const isAdmin = Boolean(adminToken) && adminToken === roomRecord.adminToken;
  const isMember = room.members.some((member) => member.id === memberCookie);
  const currentMemberId = isMember ? memberCookie : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-3 py-4 pb-28 sm:px-6 sm:py-8 lg:pb-8">
      <RememberRoom code={room.code} name={room.name} />
      <BoardFrame>
        <div className="space-y-8 px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
          <RoomHeader
            name={room.name}
            code={room.code}
            memberCount={room.members.length}
            billCount={room.bills.length}
            totalBills={room.bills.reduce(
              (sum, bill) => sum + bill.amount,
              0,
            )}
            showJoinCta={!currentMemberId}
          />

          {currentMemberId ? null : <JoinRoomPanel code={room.code} />}

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <BalanceSummary room={room} />
            <SettlementPanel room={room} />
          </div>

          <div id="tambah-tagihan" className="scroll-mt-4">
            <AddBillForm room={room} currentMemberId={currentMemberId} />
          </div>

          <BillList room={room} isAdmin={isAdmin} />
        </div>
      </BoardFrame>

      <StickyAddBillBar />
    </main>
  );
}
