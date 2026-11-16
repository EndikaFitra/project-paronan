import { notFound } from "next/navigation";

import { AddBillForm } from "@/src/components/room/AddBillForm";
import { BalanceSummary } from "@/src/components/room/BalanceSummary";
import { BillList } from "@/src/components/room/BillList";
import { JoinRoomPanel } from "@/src/components/room/JoinRoomPanel";
import { RoomHeader } from "@/src/components/room/RoomHeader";
import { SettlementPanel } from "@/src/components/room/SettlementPanel";
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
    getAdminCookie(),
    getMemberCookie(room.id),
  ]);
  const isAdmin = Boolean(adminToken) && adminToken === roomRecord.adminToken;
  const isMember = room.members.some((member) => member.id === memberCookie);
  const currentMemberId = isMember ? memberCookie : null;

  return (
    <main className="mx-auto w-full max-w-4xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      <RoomHeader
        name={room.name}
        code={room.code}
        memberCount={room.members.length}
        billCount={room.bills.length}
        showJoinCta={!currentMemberId}
      />

      {currentMemberId ? null : <JoinRoomPanel code={room.code} />}

      <div className="grid gap-5 lg:grid-cols-2">
        <BalanceSummary room={room} />
        <SettlementPanel room={room} />
      </div>

      <AddBillForm room={room} currentMemberId={currentMemberId} />

      <BillList room={room} isAdmin={isAdmin} />
    </main>
  );
}
