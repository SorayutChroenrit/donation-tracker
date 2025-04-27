# 💡 Donatrace - แพลตฟอร์มบริจาคบนบล็อกเชน

Donatrace เป็นแพลตฟอร์มบริจาคแบบกระจายศูนย์ (Decentralized) ที่พัฒนาด้วยเทคโนโลยีบล็อกเชน Ethereum โดยมีจุดประสงค์เพื่อสร้างความโปร่งใสและเชื่อถือได้ในกระบวนการบริจาคเงิน

## 🌟 คุณสมบัติหลัก

- 🔗 **ความโปร่งใส**: ทุกการบริจาคถูกบันทึกบนบล็อกเชน ตรวจสอบได้
- 💰 **ไร้คนกลาง**: ไม่มีค่าธรรมเนียมจากตัวกลาง เงินถึงมือผู้รับโดยตรง
- 🔐 **ปลอดภัย**: ใช้ Smart Contract ในการจัดการเงินบริจาค
- 📊 **ติดตามได้**: ดูประวัติการบริจาคและความคืบหน้าแคมเปญได้แบบเรียลไทม์
- 💻 **ใช้งานง่าย**: UI/UX ที่เป็นมิตรกับผู้ใช้

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Ethers.js
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router
- **Wallet Integration**: MetaMask
- **Network**: Ethereum (Holesky Testnet)

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

Contract Address (Holesky): `0x40374915149b2A7806090D23CE9375ac98db481d`
Chain ID: `17000`


### UX/UI 

![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)

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

