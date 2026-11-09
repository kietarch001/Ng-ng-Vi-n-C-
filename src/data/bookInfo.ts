import { BookPart } from '../types/book';

export const BOOK_INFO = {
  titleVi: "Không Biện Minh! Sức Mạnh Của Kỷ Luật Bản Thân",
  titleEn: "No Excuses! The Power of Self-Discipline",
  subtitleVi: "21 nguyên tắc giúp bạn làm chủ tư duy, hành động và tạo dựng cuộc đời vượt trội",
  author: "Brian Tracy",
  publisher: "Vanguard Press / Bản dịch tiếng Việt chuẩn xác",
  year: 2010,
  pdfFileName: "No_Excuses_The_Power_of_Self-Discipline__Brian_Tracy___z-library.sk__1lib.sk__z-lib.sk__9aaeaeff.pdf",
  pdfPath: "/assets/aistudio/No_Excuses_The_Power_of_Self-Discipline__Brian_Tracy___z-library.sk__1lib.sk__z-lib.sk__9aaeaeff.pdf",
  dedicationVi: "Cuốn sách này xin được trân trọng gửi tặng người bạn và người cộng sự của tôi, Eric Berman — một trong những con người kỷ luật và kiên định nhất mà tôi từng được biết.",
  dedicationEn: "This book is fondly dedicated to my friend and partner Eric Berman, one of the most disciplined and determined people I have ever met.",
  overviewVi: "Hầu hết mọi người đều mơ ước về thành công, giàu có, sức khỏe và hạnh phúc nhưng lại sống trên 'Hòn đảo Có Một Ngày' (Someday Isle) với căn bệnh 'Viện cớ' (Excusitis). Cuốn sách kinh điển này của Brian Tracy chứng minh rằng: Kỷ luật bản thân chính là chìa khóa vạn năng duy nhất mở ra mọi cánh cửa của thành công, tài chính, năng suất làm việc, hôn nhân và sự thanh thản tâm hồn.",
};

export const BOOK_PARTS: BookPart[] = [
  {
    id: 'intro',
    titleVi: "Lời Mở Đầu: Phép Màu Của Kỷ Luật Tự Giác",
    titleEn: "Introduction: The Miracle of Self-Discipline",
    descriptionVi: "Vì sao có những người thành công hơn người khác? Bí quyết rời khỏi 'Hòn đảo Có Một Ngày' và làm chủ tương lai.",
    chapterIds: ['intro'],
  },
  {
    id: 'part1',
    titleVi: "Phần I: Kỷ Luật Bản Thân Và Thành Công Cá Nhân",
    titleEn: "Part I: Self-Discipline and Personal Success",
    descriptionVi: "Thành công phụ thuộc vào con người mà bạn trở thành. Khám phá kỷ luật về nhân cách, trách nhiệm, mục tiêu, sự xuất sắc cá nhân, lòng can đảm và tính bền bỉ.",
    chapterIds: ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7'],
  },
  {
    id: 'part2',
    titleVi: "Phần II: Kỷ Luật Bản Thân Trong Kinh Doanh, Bán Hàng Và Tài Chính",
    titleEn: "Part II: Self-Discipline in Business, Sales, and Finances",
    descriptionVi: "Bứt phá lên top 10% trong ngành của bạn. Bí quyết gia tăng năng suất gấp bội, lãnh đạo bản thân và tổ chức, nghệ thuật bán hàng, quản lý thời gian và độc lập tài chính.",
    chapterIds: ['ch8', 'ch9', 'ch10', 'ch11', 'ch12', 'ch13', 'ch14'],
  },
  {
    id: 'part3',
    titleVi: "Phần III: Kỷ Luật Bản Thân Và Cuộc Sống Tốt Đẹp",
    titleEn: "Part III: Self-Discipline and the Good Life",
    descriptionVi: "Ứng dụng kỷ luật vào những điều cốt lõi nhất của cuộc đời: hạnh phúc nội tâm, sức khỏe dẻo dai, thể lực, hôn nhân bền chặt, nuôi dạy con cái, tình bạn chân chính và sự an yên trong tâm hồn.",
    chapterIds: ['ch15', 'ch16', 'ch17', 'ch18', 'ch19', 'ch20', 'ch21'],
  },
];
