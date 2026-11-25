import type { SpreadDefinition } from '../types/tarot';

export const SPREADS: SpreadDefinition[] = [
  {
    id: 'past-present-future',
    name: 'Quá Khứ · Hiện Tại · Tương Lai',
    subtitle: 'Nhìn lại dòng chảy thời gian và xu hướng sắp tới',
    category: 'Dòng thời gian',
    cardCount: 3,
    layout: 'row3',
    badge: 'Phổ biến',
    positions: [
      {
        index: 0,
        title: 'Quá Khứ',
        description: 'Nền tảng, sự kiện hoặc bài học đã dẫn bạn đến hiện tại.',
      },
      {
        index: 1,
        title: 'Hiện Tại',
        description: 'Trạng thái, năng lượng và điều đang diễn ra ngay lúc này.',
      },
      {
        index: 2,
        title: 'Tương Lai (Xu hướng)',
        description: 'Hướng phát triển có thể xảy ra nếu mọi thứ giữ nguyên nhịp hiện tại.',
      },
    ],
    sampleQuestions: [
      'Điều gì đang định hình giai đoạn này của mình và hướng đi sắp tới ra sao?',
      'Mình nên chú ý điều gì trong chu kỳ chuyển tiếp hiện tại?',
      'Bức tranh tổng thể về cuộc sống của mình trong vài tháng tới là gì?',
    ],
  },
  {
    id: 'love',
    name: 'Tình Yêu & Kết Nối',
    subtitle: 'Khám phá cảm xúc, nhu cầu, điểm kết nối và rào cản',
    category: 'Tình cảm',
    cardCount: 6,
    layout: 'relationship6',
    badge: 'Chuyên sâu',
    positions: [
      {
        index: 0,
        title: 'Bạn đang cảm thấy gì',
        description: 'Trạng thái trái tim và cảm xúc thật sự bên trong bạn lúc này.',
      },
      {
        index: 1,
        title: 'Điều bạn cần',
        description: 'Nhu cầu tình cảm, sự an toàn hoặc ranh giới mà bạn đang tìm kiếm.',
      },
      {
        index: 2,
        title: 'Điều đang kết nối',
        description: 'Sợi dây liên kết hoặc điểm chung đang giữ hai người gần nhau.',
      },
      {
        index: 3,
        title: 'Điều đang cản trở',
        description: 'Rào cản, hiểu lầm hoặc nỗi sợ cần được nhìn thẳng.',
      },
      {
        index: 4,
        title: 'Điều cần cải thiện',
        description: 'Cách bạn có thể điều chỉnh giao tiếp và hành động cho lành mạnh hơn.',
      },
      {
        index: 5,
        title: 'Hướng phát triển',
        description: 'Xu hướng tự nhiên của kết nối này nếu giữ nhịp hiện tại.',
      },
    ],
    sampleQuestions: [
      'Mình cần hiểu gì về mối quan hệ này lúc này?',
      'Điều gì đang giúp hoặc cản trở việc kết nối giữa tụi mình?',
      'Mình cần chú ý nhu cầu và ranh giới nào để đón nhận tình cảm lành mạnh hơn?',
    ],
  },
  {
    id: 'career',
    name: 'Sự Nghiệp & Tài Chính',
    subtitle: 'Đánh giá hiện trạng, điểm mạnh, rào cản, cơ hội và hướng đi',
    category: 'Công việc',
    cardCount: 5,
    layout: 'decision5',
    positions: [
      {
        index: 0,
        title: 'Hiện trạng công việc',
        description: 'Vị thế, nguồn lực và động lực thực tế của bạn lúc này.',
      },
      {
        index: 1,
        title: 'Điểm mạnh',
        description: 'Năng lực hoặc lợi thế bạn đang có (hoặc chưa dùng hết).',
      },
      {
        index: 2,
        title: 'Điều đang cản',
        description: 'Điểm nghẽn, thói quen hoặc áp lực đang làm chậm tiến độ.',
      },
      {
        index: 3,
        title: 'Cơ hội',
        description: 'Cửa mở hoặc nguồn lực tiềm năng có thể tận dụng.',
      },
      {
        index: 4,
        title: 'Hướng đi nên cân nhắc',
        description: 'Cách tiếp cận thiết thực để xây nền công việc và tài chính vững hơn.',
      },
    ],
    sampleQuestions: [
      'Điều gì giúp mình xây nền công việc và tài chính vững hơn trong 6 tháng tới?',
      'Điểm mạnh nào của mình đang chưa được dùng hết trong công việc hiện tại?',
      'Mình nên làm gì với dự án hoặc kế hoạch công việc đang dở dang?',
    ],
  },
  {
    id: 'decision',
    name: 'Ra Quyết Định (A hay B)',
    subtitle: 'Soi chiếu hai phương án theo giá trị cá nhân trước khi chọn',
    category: 'Định hướng',
    cardCount: 5,
    layout: 'decision5',
    positions: [
      {
        index: 0,
        title: 'Hiện trạng',
        description: 'Bối cảnh và tâm thế của bạn trước ngã rẽ.',
      },
      {
        index: 1,
        title: 'Nếu chọn A, điều gì xảy ra',
        description: 'Năng lượng, trải nghiệm hoặc xu hướng nếu đi theo hướng A.',
      },
      {
        index: 2,
        title: 'Nếu chọn B, điều gì xảy ra',
        description: 'Năng lượng, trải nghiệm hoặc xu hướng nếu đi theo hướng B.',
      },
      {
        index: 3,
        title: 'Điều cần cân nhắc thêm',
        description: 'Góc khuất hoặc dữ kiện thực tế bạn dễ bỏ qua.',
      },
      {
        index: 4,
        title: 'Lời khuyên tổng thể',
        description: 'Gợi ý giúp bạn chọn điều phù hợp với giá trị cốt lõi của bản thân.',
      },
    ],
    sampleQuestions: [
      'Mình nên cân nhắc điều gì giữa việc tiếp tục hướng cũ (A) và thử hướng mới (B)?',
      'Hai lựa chọn trước mắt sẽ mang lại bài học gì cho mình?',
      'Điều gì quan trọng nhất mình cần ưu tiên khi quyết định việc này?',
    ],
  },
  {
    id: 'self-care',
    name: 'Tự Chăm Sóc & Chữa Lành',
    subtitle: 'Lắng nghe cơ thể, tinh thần và tìm lại sự cân bằng nội tâm',
    category: 'Nội tâm',
    cardCount: 4,
    layout: 'grid4',
    positions: [
      {
        index: 0,
        title: 'Điều đang mệt',
        description: 'Nơi năng lượng của bạn đang bị tiêu hao âm thầm.',
      },
      {
        index: 1,
        title: 'Điều nuôi dưỡng',
        description: 'Nguồn lực hoặc thói quen giúp bạn hồi phục.',
      },
      {
        index: 2,
        title: 'Điều nên buông',
        description: 'Suy nghĩ hay kỳ vọng không còn phục vụ bạn nữa.',
      },
      {
        index: 3,
        title: 'Việc nhỏ hôm nay',
        description: 'Một bước nhẹ nhàng bạn có thể làm ngay cho bản thân.',
      },
    ],
    sampleQuestions: [
      'Mình đang cần chăm sóc khía cạnh nào của bản thân nhất lúc này?',
      'Làm sao để mình lấy lại sự bình yên và nhịp sống cân bằng hơn?',
      'Điều gì mình đang ôm giữ quá chặt và có thể nhẹ nhàng đặt xuống?',
    ],
  },
  {
    id: 'shadow-work',
    name: 'Bóng Tối Nội Tâm (Shadow Work)',
    subtitle: 'Nhận diện điều đang né tránh, cơ chế tự vệ và cách chấp nhận',
    category: 'Tự vấn sâu',
    cardCount: 4,
    layout: 'grid4',
    badge: 'Mới',
    positions: [
      {
        index: 0,
        title: 'Điều mình đang né',
        description: 'Cảm xúc, sự thật hoặc khía cạnh bản thân bạn hay tránh nhìn thẳng.',
      },
      {
        index: 1,
        title: 'Điều mình tự nói với mình',
        description: 'Niềm tin ngầm hoặc câu chuyện nội tâm đang chi phối phản ứng.',
      },
      {
        index: 2,
        title: 'Điều đang bảo vệ mình',
        description: 'Cơ chế phòng vệ từng giúp bạn an toàn nhưng nay có thể gây gò bó.',
      },
      {
        index: 3,
        title: 'Cách chấp nhận',
        description: 'Hướng tiếp cận dịu dàng để hòa giải và chuyển hóa phần bóng tối này.',
      },
    ],
    sampleQuestions: [
      'Điều gì bên trong đang âm thầm chi phối phản ứng của mình gần đây?',
      'Mình đang né tránh đối diện với nỗi sợ hoặc nhu cầu nào?',
      'Làm sao để mình thấu hiểu và chấp nhận bản thân trọn vẹn hơn?',
    ],
  },
  {
    id: 'daily',
    name: 'Thông Điệp Hôm Nay',
    subtitle: 'Một lá bài súc tích để định tâm và gợi mở cho ngày mới',
    category: 'Hằng ngày',
    cardCount: 1,
    layout: 'single',
    positions: [
      {
        index: 0,
        title: 'Thông điệp chủ đạo',
        description: 'Điều bạn nên lưu tâm nhất trong ngày hôm nay.',
      },
    ],
    sampleQuestions: [
      'Điều mình nên lưu tâm hôm nay là gì?',
      'Năng lượng nào sẽ hỗ trợ mình tốt nhất trong ngày hôm nay?',
      'Hôm nay mình cần giữ thái độ sống như thế nào?',
    ],
  },
  {
    id: 'celtic-cross',
    name: 'Chữ Thập Celtic',
    subtitle: 'Trải bài kinh điển 10 lá soi chiếu trục thời gian & nội tâm – ngoại cảnh',
    category: 'Kinh điển',
    cardCount: 10,
    layout: 'celtic10',
    badge: '10 lá',
    positions: [
      { index: 0, title: '1. Hiện tại', description: 'Tâm điểm của vấn đề ngay lúc này.' },
      { index: 1, title: '2. Thử thách chéo', description: 'Điều đang cản trở hoặc tác động trực tiếp.' },
      { index: 2, title: '3. Nền tảng', description: 'Gốc rễ sâu xa và yếu tố vô thức.' },
      { index: 3, title: '4. Quá khứ gần', description: 'Sự kiện vừa đi qua và còn dư âm.' },
      { index: 4, title: '5. Ý thức / Mục tiêu', description: 'Điều bạn hướng tới hoặc mong muốn cao nhất.' },
      { index: 5, title: '6. Tương lai gần', description: 'Chuyển biến sắp xuất hiện trước mắt.' },
      { index: 6, title: '7. Bản thân', description: 'Thái độ và cách bạn nhìn nhận chính mình.' },
      { index: 7, title: '8. Môi trường', description: 'Ảnh hưởng từ hoàn cảnh và người xung quanh.' },
      { index: 8, title: '9. Hy vọng & Nỗi sợ', description: 'Mong mỏi và băn khoăn thầm kín.' },
      { index: 9, title: '10. Xu hướng kết quả', description: 'Hướng đi nếu tiếp tục theo quỹ đạo hiện tại.' },
    ],
    sampleQuestions: [
      'Bức tranh toàn cảnh về bước ngoặt hiện tại trong cuộc sống của mình là gì?',
      'Những yếu tố ẩn và rõ nào đang chi phối vấn đề mình quan tâm?',
      'Mình cần hiểu rõ điều gì trước khi bước sang giai đoạn mới?',
    ],
  },
];
