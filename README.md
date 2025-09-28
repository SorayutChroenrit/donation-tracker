# 💡 Donatrace - แพลตฟอร์มบริจาคบนบล็อกเชน

Donatrace เป็นแพลตฟอร์มบริจาคแบบกระจายศูนย์ (Decentralized) ที่พัฒนาด้วยเทคโนโลยีบล็อกเชน Ethereum โดยมีจุดประสงค์เพื่อสร้างความโปร่งใสและเชื่อถือได้ในกระบวนการบริจาคเงิน

## 🌟 คุณสมบัติหลัก

- 🔗 **ความโปร่งใส**: ทุกการบริจาคถูกบันทึกบนบล็อกเชน ตรวจสอบได้
- 💰 **ไร้คนกลาง**: ไม่มีค่าธรรมเนียมจากตัวกลาง เงินถึงมือผู้รับโดยตรง
- 🔐 **ปลอดภัย**: ใช้ Smart Contract ในการจัดการเงินบริจาค
- 📊 **ติดตามได้**: ดูประวัติการบริจาคและความคืบหน้าแคมเปญได้แบบเรียลไทม์
- 💻 **ใช้งานง่าย**: UI/UX ที่เป็นมิตรกับผู้ใช้

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

### Blockchain

![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Ethers.js](https://img.shields.io/badge/Ethers.js-2535A0?style=for-the-badge&logo=ethereum&logoColor=white)
![MetaMask](https://img.shields.io/badge/MetaMask-F6851B?style=for-the-badge&logo=metamask&logoColor=white)

### UI & Styling

![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

### Development Tools

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

**Network**: Ethereum Holesky Testnet

## 🚀 การติดตั้งและรันโปรเจค

### ความต้องการเบื้องต้น

- Node.js (v16 หรือสูงกว่า)
- npm หรือ yarn
- MetaMask browser extension
- Git

### ขั้นตอนการติดตั้ง

1. Clone โปรเจค

```bash
git clone https://github.com/SorayutChroenrit/donatrace.git
cd donatrace
```

2. ติดตั้ง dependencies

```bash
npm install
# หรือ
yarn install
```

3. สร้างไฟล์ `contract.ts` และกำหนดค่าต่อไปนี้

```typescript
export const HOLESKY_CHAIN_ID = 17000;
export const HOLESKY_RPC_URL = "https://ethereum-holesky.publicnode.com/";
export const CONTRACT_ADDRESS = "0x40374915149b2A7806090D23CE9375ac98db481d";
export const CONTRACT_ABI = [ ... ]; // วางข้อมูล ABI ที่นี่
```

4. รันโปรเจคในโหมด development

```bash
npm run dev
# หรือ
yarn dev
```

5. เปิดเบราว์เซอร์และเข้าไปที่ `http://localhost:5173`

## 🤝 วิธีการใช้งาน

### 1. การเชื่อมต่อ Wallet

1. คลิกปุ่ม "Connect Wallet" ที่มุมขวาบน
2. เลือก MetaMask หรือ wallet ที่ต้องการใช้
3. ยืนยันการเชื่อมต่อและเปลี่ยนเครือข่ายไปที่ Holesky Testnet

### 2. การสร้างแคมเปญรับบริจาค

1. คลิกที่เมนู "Create Campaign"
2. กรอกข้อมูลแคมเปญ:
   - ชื่อแคมเปญ
   - รายละเอียด
   - เป้าหมายการรับบริจาค (ETH)
3. คลิก "Create Campaign" และยืนยันธุรกรรมใน MetaMask
4. รอการยืนยันบนบล็อกเชน

### 3. การบริจาคให้แคมเปญ

1. ไปที่หน้า "Active Campaigns"
2. เลือกแคมเปญที่ต้องการบริจาค
3. คลิกปุ่ม "Donate"
4. ระบุจำนวนเงิน (ETH) และข้อความ (ถ้าต้องการ)
5. ยืนยันธุรกรรมใน MetaMask

### 4. การติดตามประวัติการบริจาค

1. ไปที่หน้า "My Donations"
2. ดูรายการบริจาคทั้งหมดของคุณ
3. คลิกเพื่อดูรายละเอียดแคมเปญ

### 5. การจัดการแคมเปญ (สำหรับเจ้าของ)

1. เข้าไปที่แคมเปญของคุณ
2. คุณสามารถ:
   - ดูรายการผู้บริจาค
   - ถอนเงินบริจาคที่ได้รับ
   - ปิดแคมเปญ

## 📜 Smart Contract

Smart Contract ของ Donatrace มีฟังก์ชันหลักดังนี้:

- `createCampaign`: สร้างแคมเปญใหม่
- `donate`: บริจาคเงินให้แคมเปญ
- `withdrawFunds`: ถอนเงินบริจาคจากแคมเปญ
- `closeCampaign`: ปิดแคมเปญ

### ฟังก์ชันสำคัญเพิ่มเติม:

- `getCampaign`: ดึงข้อมูลแคมเปญ
- `getAllUserDonations`: ดึงข้อมูลการบริจาคทั้งหมดของผู้ใช้
- `getCampaignDonationsCount`: นับจำนวนการบริจาคในแคมเปญ
- `totalDonations`: ดูยอดเงินบริจาครวม

**Contract Address (Holesky)**: `0x40374915149b2A7806090D23CE9375ac98db481d`  
**Chain ID**: `17000`

## 📸 Screenshots

### Home Page

![Home Page](https://res.cloudinary.com/dn0nkvay2/image/upload/v1745740604/Screenshot_2568-04-27_at_12.55.33_j424uc.png)

### Active Campaigns

![Active Campaign](https://res.cloudinary.com/dn0nkvay2/image/upload/v1745740695/Screenshot_2568-04-27_at_13.23.33_ssmlss.png)

### Create Campaign

![Create Campaign](https://res.cloudinary.com/dn0nkvay2/image/upload/v1745740694/Screenshot_2568-04-27_at_13.23.56_dinqw8.png)

### My Donations

![My Donation](https://res.cloudinary.com/dn0nkvay2/image/upload/v1745740694/Screenshot_2568-04-27_at_13.24.17_zommly.png)

### How to Use

![How to use](https://res.cloudinary.com/dn0nkvay2/image/upload/v1745740674/Screenshot_2568-04-27_at_13.24.35_pazbib.png)

![How to use](https://res.cloudinary.com/dn0nkvay2/image/upload/v1745740957/Screenshot_2568-04-27_at_15.02.20_yhnd4h.png)

## 🛠️ การแก้ไขปัญหาที่พบบ่อย

### ปัญหา: ไม่สามารถเชื่อมต่อ MetaMask

1. ตรวจสอบว่าติดตั้ง MetaMask แล้ว
2. ตรวจสอบว่าเชื่อมต่อกับ Holesky Testnet
3. ลองรีเฟรชหน้าเว็บ

### ปัญหา: Transaction ล้มเหลว

1. ตรวจสอบว่ามี ETH เพียงพอในกระเป๋า
2. ตรวจสอบค่า Gas fee
3. ตรวจสอบว่าอยู่ในเครือข่าย Holesky

### ปัญหา: ไม่เห็นแคมเปญ

1. รอสักครู่ให้ข้อมูลโหลด
2. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
3. ลองรีเฟรชหน้าเว็บ

## 📄 ใบอนุญาต

โปรเจคนี้อยู่ภายใต้ MIT License

## 👨‍💻 ผู้พัฒนา

- **Sorayut Chroenrit** - Full Stack Developer
- GitHub: [@SorayutChroenrit](https://github.com/SorayutChroenrit)

หากมีคำถามหรือข้อเสนอแนะ สามารถติดต่อได้ที่ [sorayutwork@gmail.com](mailto:sorayutwork@gmail.com)
