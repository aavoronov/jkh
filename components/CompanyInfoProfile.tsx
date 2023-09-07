import Image from "next/image";
import { CSSProperties } from "react";

const CompanyInfoProfile = ({ style, textStyle }: { style?: CSSProperties; textStyle?: CSSProperties }) => {
  return (
    <div style={{ width: 180, display: "flex", flexDirection: "column", flexShrink: 0, ...style }}>
      <Image src='/img/companyInfoPic.png' height={150} width={180} />
      <div style={{ display: "flex", flexDirection: "row", columnGap: 10, marginTop: 16 }}>
        <div style={{ flexShrink: 0 }}>
          <Image src='/img/companyInfoCheck.png' height={32} width={32} />
        </div>
        <span style={{ fontSize: 12, color: "#fff", ...textStyle }}>Данные компании проверены</span>
      </div>
    </div>
  );
};

export default CompanyInfoProfile;
