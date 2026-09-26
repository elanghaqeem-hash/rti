const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const bcrypt = require('bcryptjs');

const adapter = new PrismaBetterSqlite3({ url: 'file:dev.db' });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('--- SEEDING ALL DATABASE PROCESSES ---');
  const defaultPassword = await bcrypt.hash('Technotama2025!', 10);
  const bcmPassword = await bcrypt.hash('BCM@SECURE2025!', 10);

  // 1. Seed / Upsert Users
  const users = [
    { email: 'admin@technotama.id', name: 'Admin Technotama', password: defaultPassword, role: 'ADMIN', company: 'PT Technotama Artha Raya' },
    { email: 'client@bankdki.co.id', name: 'Bank DKI Client', password: defaultPassword, role: 'CLIENT', company: 'PT Bank DKI' },
    { email: 'customercare@technotama.id', name: 'Admin Customer Care', password: defaultPassword, role: 'ADMIN_CUSTOMER_CARE', company: 'PT Technotama Artha Raya' },
    { email: 'admin.security@jma-advisory.id', name: 'Muhammad Nadhil, CISA, CRISC', password: bcmPassword, role: 'SUPER_ADMIN', company: 'PT JMA Solusi Konsultindo' },
    { email: 'sarah.wijaya@jma-advisory.id', name: 'Sarah Wijaya, CBCP, ISO 22301 LA', password: bcmPassword, role: 'LEAD_CONSULTANT', company: 'PT JMA Solusi Konsultindo' },
    { email: 'hendra.gunawan@jma-advisory.id', name: 'Dr. Hendra Gunawan, MM', password: bcmPassword, role: 'DIRECTOR', company: 'PT JMA Solusi Konsultindo' },
    { email: 'rian.aditya@banknusantara.co.id', name: 'Rian Aditya', password: bcmPassword, role: 'CLIENT_COORDINATOR', company: 'PT Bank Nusantara Sejahtera Tbk' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, company: u.company },
      create: u
    });
  }
  console.log('✓ Users seeded/verified');

  // 2. Seed BCM Users
  const bcmUsers = [
    { userCode: 'USR-01', username: 'superadmin_sec', email: 'admin.security@jma-advisory.id', name: 'Muhammad Nadhil, CISA, CRISC', role: 'Super Administrator', org: 'PT JMA Solusi Konsultindo', mfaType: 'Hardware FIDO2 / TOTP', status: 'ACTIVE' },
    { userCode: 'USR-02', username: 'sarah_lead_bcm', email: 'sarah.wijaya@jma-advisory.id', name: 'Sarah Wijaya, CBCP, ISO 22301 LA', role: 'Lead BCM Consultant', org: 'PT JMA Solusi Konsultindo', mfaType: 'TOTP Authenticator', status: 'ACTIVE' },
    { userCode: 'USR-03', username: 'hendra_director', email: 'hendra.gunawan@jma-advisory.id', name: 'Dr. Hendra Gunawan, MM', role: 'Director / Principal Advisor', org: 'PT JMA Solusi Konsultindo', mfaType: 'TOTP Authenticator', status: 'ACTIVE' },
    { userCode: 'USR-04', username: 'rian_coord', email: 'rian.aditya@banknusantara.co.id', name: 'Rian Aditya', role: 'Client BCM Coordinator', org: 'PT Bank Nusantara Sejahtera Tbk', mfaType: 'SMS OTP', status: 'ACTIVE' },
    { userCode: 'USR-05', username: 'auditor_bssn', email: 'auditor.compliance@bssn.go.id', name: 'External Auditor BSSN', role: 'Compliance Auditor', org: 'BSSN Compliance Directorate', mfaType: 'Pending Reset', status: 'LOCKED' },
  ];

  for (const bu of bcmUsers) {
    await prisma.bcmUser.upsert({
      where: { userCode: bu.userCode },
      update: { status: bu.status, role: bu.role },
      create: bu
    });
  }
  console.log('✓ BCM Users seeded');

  // 3. Seed BCM Assessments (BIA)
  const assessments = [
    { processId: 'proc-01', processName: 'Sistem Pembayaran RTGS & SKNBI', businessUnit: 'Treasury & Payment Settlement', operationalImpact: 4, financialImpactPerHour: 250, mtpdHours: 4, rtoHours: 2, rpoMinutes: 15, spofComponents: 'Single Gateway Router RTGS-BI', recoveryStrategy: 'Hot-Standby Automated Failover ke DRC Sentul', status: 'APPROVED_ADVISORY' },
    { processId: 'proc-02', processName: 'Core Banking API & Mobile Switching', businessUnit: 'Digital Banking Operations', operationalImpact: 5, financialImpactPerHour: 400, mtpdHours: 3, rtoHours: 1, rpoMinutes: 5, spofComponents: 'Database Active Sync Lag', recoveryStrategy: 'Multi-Region Active-Active Cloud Replica', status: 'REVIEWED' },
    { processId: 'proc-03', processName: 'ATM Network & Cash Replenishment', businessUnit: 'Card & Delivery Channels', operationalImpact: 3, financialImpactPerHour: 150, mtpdHours: 8, rtoHours: 4, rpoMinutes: 30, spofComponents: 'VSAT Network Hub Provider', recoveryStrategy: 'Dual Cellular 4G/5G Backup WAN', status: 'IN_REVIEW' },
    { processId: 'proc-04', processName: 'Trade Finance & Garansi Bank', businessUnit: 'Corporate Banking Services', operationalImpact: 2, financialImpactPerHour: 80, mtpdHours: 24, rtoHours: 12, rpoMinutes: 60, spofComponents: 'DocuSign Integration Connector', recoveryStrategy: 'Manual Fallback Protocol with Digital Watermark', status: 'DRAFT' }
  ];

  for (const a of assessments) {
    await prisma.bcmAssessment.upsert({
      where: { processId: a.processId },
      update: a,
      create: a
    });
  }
  console.log('✓ BCM Assessments seeded');

  // 4. Seed BCM Approvals
  const approvals = [
    { approvalCode: 'APP-01', processName: 'Sistem Pembayaran RTGS & SKNBI', businessUnit: 'Treasury & Payment Settlement', submitter: 'Sarah Wijaya', rto: '1.5 Jam', rpo: '0 Menit (Sync)', status: 'PENDING' },
    { approvalCode: 'APP-02', processName: 'Core Banking API & Mobile Switching', businessUnit: 'Digital Banking Operations', submitter: 'Sarah Wijaya', rto: '2.0 Jam', rpo: '15 Menit', status: 'PENDING' },
    { approvalCode: 'APP-03', processName: 'ATM Network & Cash Replenishment', businessUnit: 'Card & Delivery Channels', submitter: 'Sarah Wijaya', rto: '4.0 Jam', rpo: '30 Menit', status: 'PENDING' }
  ];

  for (const ap of approvals) {
    await prisma.bcmApproval.upsert({
      where: { approvalCode: ap.approvalCode },
      update: { status: ap.status },
      create: ap
    });
  }
  console.log('✓ BCM Approvals seeded');

  // 5. Seed BCM Documents (DRL)
  const documents = [
    { docCode: 'DRL-01', title: 'Topologi Jaringan DC & DRC Tier-3', department: 'IT Infrastructure', status: 'ACCEPTED', submissionDate: '08 Sep 2026', notes: 'Diverifikasi oleh Lead Consultant. Standar redundansi terpenuhi.' },
    { docCode: 'DRL-02', title: 'SOP Rencana Evakuasi & Crisis Call Tree', department: 'Human Capital & GA', status: 'SUBMITTED', submissionDate: '09 Sep 2026', notes: 'Menunggu review dokumen call tree terbaru.' },
    { docCode: 'DRL-03', title: 'Perjanjian Kerjasama (SLA) Cloud & Data Provider', department: 'Vendor Management', status: 'REQUESTED', submissionDate: 'Menunggu Berkas', notes: 'Wajib menyertakan jaminan RTO dari ISP provider.' },
    { docCode: 'DRL-04', title: 'Hasil Uji Beban Genset & Cadangan UPS 24 Jam', department: 'Facility Management', status: 'REQUESTED', submissionDate: 'Menunggu Berkas', notes: 'Laporan pengujian simulasi pemadaman total.' }
  ];

  for (const doc of documents) {
    await prisma.bcmDocument.upsert({
      where: { docCode: doc.docCode },
      update: { status: doc.status },
      create: doc
    });
  }
  console.log('✓ BCM Documents seeded');

  // 6. Seed Support Tickets if empty
  const ticketCount = await prisma.supportTicket.count();
  if (ticketCount === 0) {
    const clientUser = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
    if (clientUser) {
      await prisma.supportTicket.create({
        data: {
          clientId: clientUser.id,
          subject: 'Permintaan Jadwal Re-test Penetration Testing Core Banking',
          message: 'Halo tim Technotama, kami telah memitigasi 3 temuan Medium dari laporan VA minggu lalu. Mohon konfirmasi jadwal pelaksanaan re-testing.',
          status: 'OPEN'
        }
      });
      console.log('✓ Sample Support Ticket seeded');
    }
  }

  // 7. Seed Initial BCM Audit Log
  const logCount = await prisma.bcmAuditLog.count();
  if (logCount === 0) {
    await prisma.bcmAuditLog.createMany({
      data: [
        { action: 'MFA_AUTHENTICATION_SUCCESS', actor: 'superadmin_sec', role: 'Super Administrator', ipAddress: '192.168.10.4', details: 'Hardware token FIDO2 verified. User session established.' },
        { action: 'BIA_CALCULATOR_RUN', actor: 'sarah_lead_bcm', role: 'Lead BCM Consultant', ipAddress: '192.168.10.12', details: 'Calculated MTPD=4h, RTO=2h for RTGS Payment Settlement process.' },
        { action: 'DRL_EVIDENCE_UPLOAD', actor: 'rian_coord', role: 'Client BCM Coordinator', ipAddress: '10.20.1.88', details: 'Uploaded evidence file DRL-02: SOP Rencana Evakuasi & Crisis Call Tree.' }
      ]
    });
    console.log('✓ BCM Audit Logs seeded');
  }

  console.log('--- ALL PROCESSES SUCCESSFULLY SEEDED INTO DATABASE! ---');
  await prisma.$disconnect();
}

seed().catch(err => {
  console.error('Seed Error:', err);
  process.exit(1);
});
