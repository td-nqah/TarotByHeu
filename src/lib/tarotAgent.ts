import type { AISettings, ChatMessage, DrawnCard, SpreadDefinition } from '../types/tarot';

const CRISIS_PATTERNS = [
  /tự tử/i,
  /tự sát/i,
  /tự hại/i,
  /muốn chết/i,
  /không muốn sống/i,
  /kết thúc cuộc đời/i,
  /chấm dứt tất cả/i,
  /nhảy lầu/i,
  /uống thuốc tự/i,
];

const DOMESTIC_ABUSE_PATTERNS = [/bạo lực/i, /đánh đập/i, /bị kiểm soát/i, /đe dọa/i, /ép buộc/i];
const MEDICAL_PATTERNS = [/bệnh/i, /ung thư/i, /chẩn đoán/i, /thuốc/i, /phẫu thuật/i, /bác sĩ/i, /sức khỏe/i, /đau ốm/i];
const FERTILITY_PATTERNS = [/mang thai/i, /có bầu/i, /sảy thai/i, /vô sinh/i, /hiếm muộn/i];
const LEGAL_FINANCE_PATTERNS = [
  /cổ phiếu/i,
  /chứng khoán/i,
  /crypto/i,
  /bitcoin/i,
  /mua mã/i,
  /đầu tư/i,
  /vay nợ/i,
  /kiện tụng/i,
  /pháp lý/i,
  /ly hôn/i,
  /tòa án/i,
];
const GAMBLING_OR_GUESS_PATTERNS = [/xổ số/i, /vietlott/i, /lô đề/i, /số trúng/i, /đoán xem.*tên/i, /tôi bao nhiêu tuổi/i];
const THIRD_PARTY_PATTERNS = [
  /anh ấy.*nghĩ/i,
  /cô ấy.*nghĩ/i,
  /người ấy.*nghĩ/i,
  /họ.*nghĩ gì/i,
  /có yêu mình không/i,
  /có thương mình không/i,
  /ngoại tình/i,
  /người thứ ba/i,
  /quay lại với mình/i,
];
const YES_NO_PATTERNS = [
  /có nên .* không\??$/i,
  /có .* hay không/i,
  /được không\??$/i,
  /phải không\??$/i,
  /có thành công không/i,
  /có quay lại không/i,
];

export interface AgentResult {
  content: string;
  isCrisis?: boolean;
  usedFallback?: boolean;
  fallbackReason?: string;
}

export function isCrisisText(text: string): boolean {
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

export function getCrisisResponse(): string {
  return `### Mình xin tạm dừng trải bài lúc này

Mình nhận thấy bạn đang trải qua cảm giác rất nặng nề hoặc bế tắc. Lúc này, điều quan trọng nhất không phải là đọc bài Tarot mà là **sự an toàn và tinh thần của chính bạn**.

- Hãy liên hệ ngay với một người thân hoặc người bạn mà bạn tin tưởng để không phải ở một mình lúc này.
- Nếu cảm thấy không an toàn, hãy gọi **115** (cấp cứu tại Việt Nam) hoặc đến **cơ sở y tế gần nhất** để được hỗ trợ kịp thời.
- Bạn cũng nên trao đổi với bác sĩ hoặc chuyên gia tâm lý để có sự đồng hành chuyên môn và an toàn.

Mình ở đây và sẵn sàng tiếp tục khi bạn thấy bình tĩnh, ổn định hơn.`;
}

function reframeQuestion(question: string, spread: SpreadDefinition): {
  clarified: string;
  wasReframed: boolean;
} {
  const q = question.trim();
  if (!q) return { clarified: spread.sampleQuestions[0], wasReframed: false };

  if (THIRD_PARTY_PATTERNS.some((r) => r.test(q))) {
    return {
      clarified: `Mình đang cảm thấy, cần gì và nên hành động ra sao trong tình huống liên quan đến câu hỏi "${q}"?`,
      wasReframed: true,
    };
  }
  if (YES_NO_PATTERNS.some((r) => r.test(q))) {
    return {
      clarified: `Điều gì giúp mình nhìn rõ xu hướng và lựa chọn tốt nhất cho băn khoăn "${q}"?`,
      wasReframed: true,
    };
  }
  return { clarified: q, wasReframed: false };
}

function getContextDisclaimers(question: string): string[] {
  const notes: string[] = [];
  if (DOMESTIC_ABUSE_PATTERNS.some((r) => r.test(question))) {
    notes.push(
      'Ưu tiên an toàn cá nhân: Nếu bạn đang đối mặt với bạo lực hoặc bị kiểm soát, xin ưu tiên sự an toàn của bản thân và liên hệ người thân tin cậy, cơ quan chức năng hoặc chuyên gia hỗ trợ — bài Tarot không khuyên bạn "chịu đựng hay ở lại trong nguy hiểm".'
    );
  }
  if (MEDICAL_PATTERNS.some((r) => r.test(question))) {
    notes.push(
      'Lưu ý sức khỏe: Tarot không thay thế chẩn đoán hay chỉ định y tế. Trải bài chỉ phản chiếu trạng thái tinh thần; hãy thăm khám bác sĩ nếu có vấn đề thể chất.'
    );
  }
  if (FERTILITY_PATTERNS.some((r) => r.test(question))) {
    notes.push(
      'Lưu ý tế nhị: Tarot không thể xác nhận hay dự đoán các vấn đề thai sản/sinh sản. Mọi thông tin dưới đây chỉ phản chiếu cảm xúc và sự chăm sóc tinh thần; bạn nên tham vấn bác sĩ chuyên khoa.'
    );
  }
  if (LEGAL_FINANCE_PATTERNS.some((r) => r.test(question))) {
    notes.push(
      'Lưu ý tài chính / pháp lý: Tarot không đưa ra lời khuyên mua bán, đầu tư hay tư vấn pháp lý, mà chỉ soi chiếu thái độ, mức độ sẵn sàng và rủi ro tâm lý.'
    );
  }
  if (GAMBLING_OR_GUESS_PATTERNS.some((r) => r.test(question))) {
    notes.push(
      'Giới hạn trung thực: Tarot không thể đoán số trúng thưởng, thông tin cá nhân cụ thể hay những dữ kiện ngẫu nhiên không có trong lá bài.'
    );
  }
  if (THIRD_PARTY_PATTERNS.some((r) => r.test(question))) {
    notes.push(
      'Góc nhìn về người thứ ba: Tarot không đọc được suy nghĩ thật của người khác. Bài dưới đây được viết lại để tập trung vào cảm xúc, ranh giới và hướng chủ động của chính bạn.'
    );
  }
  if (YES_NO_PATTERNS.some((r) => r.test(question.trim()))) {
    notes.push(
      'Câu hỏi Có / Không: Tarot không đo được đáp án nhị phân tuyệt đối; trải bài sẽ làm rõ xu hướng và điểm bạn có thể chủ động điều chỉnh.'
    );
  }
  return notes;
}

interface HolisticAnalysis {
  overviewBullets: string[];
  tensionPoint: string;
  opportunityPoint: string;
  storyArc: string;
}

function analyzeHolistic(drawnCards: DrawnCard[]): HolisticAnalysis {
  const overviewBullets: string[] = [];
  const majors = drawnCards.filter((d) => d.card.arcana === 'major');
  const minors = drawnCards.filter((d) => d.card.arcana === 'minor');
  const courts = drawnCards.filter((d) =>
    ['page', 'knight', 'queen', 'king'].includes(d.card.rank)
  );
  const aces = drawnCards.filter((d) => d.card.rank === 'ace');
  const reversedCount = drawnCards.filter((d) => d.isReversed).length;

  // 1. Major vs Minor + Fool's Journey (Phần 5.5 & 8.1)
  if (drawnCards.length >= 3) {
    if (majors.length >= Math.ceil(drawnCards.length / 3)) {
      const stage1 = majors.filter((m) => m.card.number >= 1 && m.card.number <= 7).length;
      const stage2 = majors.filter((m) => m.card.number >= 8 && m.card.number <= 14).length;
      const stage3 = majors.filter((m) => m.card.number >= 15 && m.card.number <= 21).length;
      let journeyNote = '';
      if (stage3 >= stage1 && stage3 >= stage2 && stage3 > 0) {
        journeyNote = ' (nghiêng về chặng 3 Hành trình Chàng Khờ: đối diện bóng tối, thức tỉnh và hoàn tất chu kỳ)';
      } else if (stage2 >= stage1 && stage2 > 0) {
        journeyNote = ' (nghiêng về chặng 2 Hành trình Chàng Khờ: đi sâu vào nội tâm và tìm điểm cân bằng)';
      } else if (stage1 > 0) {
        journeyNote = ' (nghiêng về chặng 1 Hành trình Chàng Khờ: xây dựng ý thức và định hình thế giới bên ngoài)';
      }
      overviewBullets.push(
        `**Tỷ lệ Đại Bí (${majors.length}/${drawnCards.length} lá):** Chủ đề mang tính bước ngoặt lớn, nhiều yếu tố vận động vượt ngoài kế hoạch nhỏ hằng ngày${journeyNote}.`
      );
    } else {
      overviewBullets.push(
        '**Tỷ lệ Tiểu Bí chiếm đa số:** Vấn đề nằm rất sát đời sống thường ngày, nghĩa là bạn có **nhiều quyền chủ động** để thay đổi hướng đi.'
      );
    }
  }

  // 2. Dominant & Missing Elements (Phần 5.2 & 8.1)
  const elemCounts: Record<string, number> = { Lửa: 0, Nước: 0, Khí: 0, Đất: 0 };
  for (const d of drawnCards) {
    for (const key of Object.keys(elemCounts)) {
      if (d.card.element.startsWith(key)) elemCounts[key]++;
    }
  }
  const activeElems = Object.entries(elemCounts).filter(([, c]) => c > 0);
  const dominantElems = activeElems.filter(([, c]) => c >= 2).map(([k]) => k);
  if (dominantElems.length > 0) {
    const elemMeanings: Record<string, string> = {
      Lửa: 'Lửa (nhiệt huyết, hành động, sự nghiệp)',
      Nước: 'Nước (cảm xúc, quan hệ, trực giác)',
      Khí: 'Khí (suy nghĩ, giao tiếp, phân tích)',
      Đất: 'Đất (thực tế, công việc cụ thể, tài chính)',
    };
    overviewBullets.push(
      `**Nguyên tố nổi trội:** ${dominantElems.map((e) => elemMeanings[e]).join(' và ')}.`
    );
  }
  if (drawnCards.length >= 4) {
    const missing = Object.entries(elemCounts)
      .filter(([, c]) => c === 0)
      .map(([k]) => k);
    if (missing.length > 0 && missing.length <= 2) {
      const missingHints: Record<string, string> = {
        Lửa: 'Lửa (dễ thiếu lực đẩy hành động dứt khoát)',
        Nước: 'Nước (dễ bỏ quên lắng nghe cảm xúc)',
        Khí: 'Khí (cần thêm sự trao đổi thẳng thắn và phân tích rạch ròi)',
        Đất: 'Đất (cần neo lại bằng kế hoạch thực tế và thói quen cụ thể)',
      };
      overviewBullets.push(
        `**Khía cạnh đang vắng mặt:** Thiếu yếu tố ${missing.map((m) => missingHints[m]).join('; ')}.`
      );
    }
  }

  // Element interactions (Phần 5.2)
  if (elemCounts['Lửa'] > 0 && elemCounts['Nước'] > 0 && drawnCards.length <= 6) {
    overviewBullets.push(
      '**Tương tác Lửa – Nước:** Năng lượng thôi thúc hành động (Lửa) và cảm xúc nhạy cảm (Nước) đang kéo nhau, dễ tạo cảm giác vừa muốn tiến nhanh vừa còn vướng bận lòng.'
    );
  } else if (elemCounts['Khí'] > 0 && elemCounts['Đất'] > 0 && drawnCards.length <= 6) {
    overviewBullets.push(
      '**Tương tác Khí – Đất:** Ý tưởng/lý thuyết (Khí) đang cần đối chiếu với nguồn lực và thực tế triển khai (Đất).'
    );
  }

  // 3. Repeated numbers, Aces, Court cards, Reversals
  if (aces.length >= 2) {
    overviewBullets.push(`**Nhiều lá Ace (${aces.length} lá):** Nhiều hạt giống và khởi đầu mới đang mở ra song song.`);
  }
  if (courts.length >= 2) {
    overviewBullets.push(
      `**Nhiều lá Cung Đình (${courts.length} lá):** Tình huống liên quan đến nhiều vai trò hoặc những cá nhân xung quanh bạn.`
    );
  }
  const numberCounts: Record<number, number> = {};
  for (const d of minors) {
    if (d.card.number >= 2 && d.card.number <= 10) {
      numberCounts[d.card.number] = (numberCounts[d.card.number] || 0) + 1;
    }
  }
  const numberThemes: Record<number, string> = {
    2: 'sự lựa chọn và cân bằng đôi bên',
    3: 'bước phát triển và hợp tác ban đầu',
    4: 'nền móng, ổn định hoặc trạng thái chững lại',
    5: 'biến động, va chạm hoặc thử thách thay đổi',
    6: 'sự hài hòa, hồi phục và trao đổi',
    7: 'sự đánh giá lại, thử thách ý chí hoặc chờ đợi',
    8: 'chuyển động nhanh, nỗ lực rèn giũa hoặc rời bỏ',
    9: 'tiệm cận hoàn tất và độ chín trải nghiệm',
    10: 'điểm cực của một chu kỳ trước khi sang trang',
  };
  for (const [numStr, cnt] of Object.entries(numberCounts)) {
    const num = Number(numStr);
    if (cnt >= 2) {
      overviewBullets.push(`**Số lặp lại (số ${num}):** Nhấn mạnh chủ đề ${numberThemes[num]}.`);
    }
  }

  if (reversedCount > drawnCards.length / 2) {
    overviewBullets.push(
      `**Tỷ lệ bài ngược (${reversedCount}/${drawnCards.length} lá):** Không mang nghĩa xấu, mà gợi ý nhiều nguồn năng lượng đang hướng vào nội tâm hoặc tạm chững để bạn gỡ dần từ bên trong.`
    );
  }

  // 4. All 11 notable pairs from Phần 8.4
  const names = new Set(drawnCards.map((d) => d.card.nameEn));
  const pairs: [string, string, string][] = [
    ['The Tower', 'The Star', '**The Tower + The Star:** Sau xáo trộn hoặc vỡ lẽ, nguồn hy vọng và chữa lành đang mở ra rõ rệt.'],
    ['Death', 'The Sun', '**Death + The Sun:** Khép lại chương cũ để bước sang giai đoạn rõ ràng và tươi sáng hơn.'],
    ['Two of Cups', 'Ten of Cups', '**Two of Cups + Ten of Cups:** Kết nối tình cảm mang xu hướng hài hòa, hướng tới sự gắn bó ấm áp.'],
    ['Eight of Cups', 'Six of Swords', '**Eight of Cups + Six of Swords:** Năng lượng rời bỏ điều không còn phù hợp để chuyển sang vùng bình yên hơn.'],
    ['Seven of Swords', 'The Moon', '**Seven of Swords + The Moon:** Thông tin có thể chưa đầy đủ hoặc thiếu minh bạch — nên kiểm chứng kỹ trước khi tin hay chốt việc.'],
    ['Ten of Wands', 'Four of Swords', '**Ten of Wands + Four of Swords:** Dấu hiệu quá tải trách nhiệm, bài khuyên ưu tiên nghỉ ngơi và hạ bớt gánh nặng.'],
    ['The Devil', 'Eight of Swords', '**The Devil + Eight of Swords:** Dấu hiệu tự trói buộc bằng nỗi sợ hoặc thói quen cũ trong tâm trí.'],
    ['The Fool', 'Two of Pentacles', '**The Fool + Two of Pentacles:** Bước khởi đầu mới đòi hỏi bạn vừa học vừa xoay xở linh hoạt.'],
    ['The Hermit', 'The High Priestess', '**The Hermit + The High Priestess:** Thời điểm rất cần sự tĩnh lặng để lắng nghe trực giác sâu bên trong.'],
    ['Ace of Pentacles', 'Eight of Pentacles', '**Ace of Pentacles + Eight of Pentacles:** Cơ hội thực tế đang có, kết quả phụ thuộc vào sự rèn luyện đều đặn.'],
    ['Three of Swords', 'Five of Cups', '**Three of Swords + Five of Cups:** Có nỗi đau và sự tiếc nuối cần được thừa nhận và dành thời gian hồi phục.'],
  ];
  for (const [a, b, msg] of pairs) {
    if (names.has(a) && names.has(b)) {
      overviewBullets.push(msg);
    }
  }

  // 5. Storytelling arc + Tension & Bright spot (Phần 8.2, 11.4, 14.1)
  const first = drawnCards[0];
  const last = drawnCards[drawnCards.length - 1];
  let storyArc = '';
  if (drawnCards.length === 1) {
    storyArc = `Lá **${first.card.nameVi}** (${first.isReversed ? 'Ngược' : 'Xuôi'}) đóng vai trò điểm neo trung tâm cho ngày hôm nay: gợi ý bạn chú ý tới **${(first.isReversed ? first.card.reversed : first.card.upright)[0]}**.`;
  } else {
    const mid = drawnCards[Math.floor(drawnCards.length / 2)];
    storyArc = `Mạch chuyện mở đầu từ **${first.card.nameVi}** tại vị trí *${first.position.title}* (nơi câu chuyện khởi phát quanh **${(first.isReversed ? first.card.reversed : first.card.upright)[0]}**), đi qua nút chuyển tại **${mid.card.nameVi}** (*${mid.position.title}*), và hướng về **${last.card.nameVi}** ở *${last.position.title}*. Vì vậy, chuyển biến tiếp theo không cố định sẵn mà phụ thuộc vào cách bạn xử lý nút thắt ở chặng giữa.`;
    if (drawnCards.length === 10) {
      const pos5 = drawnCards[4];
      storyArc += ` *(Đối chiếu trục Chữ Thập Celtic: Mục tiêu ý thức **${pos5.card.nameVi}** so với Xu hướng kết quả **${last.card.nameVi}** giúp bạn thấy rõ khoảng cách giữa điều bạn mong muốn và quỹ đạo hiện tại).*`;
    }
  }

  const challenging =
    drawnCards.find((d) =>
      ['The Tower', 'The Devil', 'Three of Swords', 'Five of Swords', 'Seven of Swords', 'Eight of Swords', 'Nine of Swords', 'Ten of Swords', 'Ten of Wands', 'Five of Pentacles', 'Five of Cups'].includes(
        d.card.nameEn
      )
    ) ?? drawnCards.find((d) => d.isReversed);

  const bright =
    drawnCards.find((d) =>
      ['The Sun', 'The Star', 'The World', 'Ace of Cups', 'Ace of Pentacles', 'Ace of Wands', 'Six of Wands', 'Nine of Cups', 'Ten of Cups', 'The Empress', 'The Magician', 'Strength'].includes(
        d.card.nameEn
      ) && !d.isReversed
    ) ?? drawnCards.find((d) => !d.isReversed);

  const tensionPoint = challenging
    ? `**Điểm căng:** Lá **${challenging.card.nameVi}** (${challenging.position.title}${challenging.isReversed ? ' · Ngược' : ''}) cho thấy áp lực hoặc điểm nghẽn quanh *${(challenging.isReversed ? challenging.card.reversed : challenging.card.upright)[0]}*.`
    : '**Điểm căng:** Bài không xuất hiện xung đột gai góc, nhưng sự chênh nhịp giữa kỳ vọng và tốc độ thực tế vẫn cần bạn kiên nhẫn điều chỉnh.';

  const opportunityPoint = bright
    ? `**Điểm sáng:** Lá **${bright.card.nameVi}** (${bright.position.title}) mở ra cơ hội và điểm tựa quanh *${bright.card.upright[0]}*${bright.card.adviceHint ? ` — ${bright.card.adviceHint.toLowerCase()}` : '.'}`
    : '**Điểm sáng:** Ngay cả khi các lá mang sắc thái thử thách hoặc ngược, điều đó giúp bạn nhìn rõ vấn đề trước khi dấn sâu thêm.';

  return { overviewBullets, tensionPoint, opportunityPoint, storyArc };
}

function buildCardInterpretation(drawn: DrawnCard, spread: SpreadDefinition): string {
  const { card, position, isReversed } = drawn;
  const orientationLabel = isReversed ? 'Ngược' : 'Xuôi';
  const keywords = isReversed ? card.reversed : card.upright;

  let text = `**${position.title} — ${card.nameVi} (${card.nameEn} · ${orientationLabel})**\n`;
  text += `- *Từ khóa & Hình ảnh:* ${keywords.join(', ')}.${card.imagery ? ` *(Biểu tượng RWS: ${card.imagery})*` : ''}\n`;

  if (card.warning) {
    text += `- *Lưu ý ẩn dụ:* ${card.warning}\n`;
  }

  if (isReversed) {
    text += `- *Ý nghĩa tại vị trí:* Ở **${position.title}** (${position.description.toLowerCase()}), thế ngược gợi ý năng lượng của *${card.nameVi}* đang bị chậm lại, hướng vào bên trong hoặc cần bạn gỡ nút thắt quanh **${keywords[0]}**.`;
  } else {
    text += `- *Ý nghĩa tại vị trí:* Tại **${position.title}** (${position.description.toLowerCase()}), lá bài gợi mở xu hướng xoay quanh **${keywords[0]}** và **${keywords[1] ?? keywords[0]}**.`;
  }

  if (spread.id === 'love' && card.loveHint) {
    text += ` Trong tình cảm: ${card.loveHint.toLowerCase()}`;
  } else if (spread.id === 'career' && card.careerHint) {
    text += ` Trong công việc: ${card.careerHint.toLowerCase()}`;
  } else if (card.adviceHint) {
    text += ` ${card.adviceHint}`;
  }

  return text;
}

function buildSuggestedActions(drawnCards: DrawnCard[], spread: SpreadDefinition): string[] {
  const actions: string[] = [];
  const hasRestCard = drawnCards.some((d) =>
    ['Four of Swords', 'The Hermit', 'Temperance', 'Ten of Wands'].includes(d.card.nameEn)
  );
  const hasActionCard = drawnCards.some((d) =>
    ['The Magician', 'The Chariot', 'Ace of Wands', 'Eight of Pentacles', 'Knight of Wands'].includes(d.card.nameEn)
  );
  const hasClarityCard = drawnCards.some((d) =>
    ['The Moon', 'Seven of Cups', 'Two of Swords', 'Ace of Swords', 'Justice'].includes(d.card.nameEn)
  );

  if (hasRestCard) {
    actions.push('Dành 20–30 phút yên tĩnh trong ngày để tách khỏi áp lực và hạ bớt một đầu việc chưa cấp thiết.');
  }
  if (hasClarityCard) {
    actions.push('Viết ra giấy đâu là dữ kiện đã kiểm chứng và đâu là phần bạn đang tự suy đoán trước khi quyết định.');
  }
  if (hasActionCard) {
    actions.push('Chọn đúng một bước hành động nhỏ có thể làm xong trong 48 giờ tới thay vì ôm đồm nhiều hướng.');
  }

  if (spread.id === 'love') {
    actions.push('Chia sẻ thẳng thắn một cảm xúc hoặc nhu cầu thật của chính bạn bằng thái độ điềm tĩnh, thay vì đoán ý đối phương.');
  } else if (spread.id === 'career') {
    actions.push('Rà soát lại công việc tuần này và dồn lực vào 1–2 hạng mục tạo giá trị thực tế rõ nhất.');
  } else if (spread.id === 'decision') {
    actions.push('Đặt phương án A và B cạnh nhau theo 3 tiêu chí: giá trị cá nhân, nguồn lực thực tế và mức độ bình yên lâu dài.');
  } else if (spread.id === 'shadow-work') {
    actions.push('Viết nhật ký 5–10 phút trả lời câu hỏi: "Nỗi sợ này đang cố bảo vệ mình khỏi điều gì?" mà không tự phán xét.');
  }

  if (actions.length === 0) {
    actions.push('Ghi lại một điều bạn nhận ra rõ nhất sau trải bài này để quan sát lại sau 1 tuần.');
    actions.push('Bắt đầu từ một bước điều chỉnh nhỏ, vừa sức ngay hôm nay.');
  }

  return actions.slice(0, 3);
}

function buildReflectionQuestion(spread: SpreadDefinition, drawnCards: DrawnCard[]): string {
  const highlightedMajor = drawnCards.find((d) => d.card.reflectionQuestion);
  if (highlightedMajor?.card.reflectionQuestion && spread.id !== 'love' && spread.id !== 'decision') {
    return `${highlightedMajor.card.reflectionQuestion} *(gợi từ lá ${highlightedMajor.card.nameVi})*`;
  }
  if (spread.id === 'love') {
    return 'Nếu tạm gác lại việc đoán xem người kia nghĩ gì, điều trái tim bạn đang thật sự cần ở kết nối này là gì?';
  }
  if (spread.id === 'decision') {
    return 'Giữa hai lựa chọn, phương án nào khiến bạn thấy chân thật với giá trị của chính mình nhất ngay cả khi có thử thách?';
  }
  if (spread.id === 'shadow-work') {
    return 'Nếu nhìn phần cảm xúc mình đang né tránh như một người bạn đang cố bảo vệ mình, bạn muốn nói gì với nó?';
  }
  const lastCard = drawnCards[drawnCards.length - 1];
  return `Nhìn vào lá **${lastCard.card.nameVi}**, có điều gì bạn vốn đã cảm nhận được từ trước nhưng chưa dám thừa nhận với chính mình không?`;
}

export function generateBuiltinReading(
  spread: SpreadDefinition,
  question: string,
  drawnCards: DrawnCard[]
): AgentResult {
  const rawQ = question.trim() || spread.sampleQuestions[0];
  if (isCrisisText(rawQ)) {
    return { content: getCrisisResponse(), isCrisis: true };
  }

  const { clarified, wasReframed } = reframeQuestion(rawQ, spread);
  const disclaimers = getContextDisclaimers(rawQ);
  const holistic = analyzeHolistic(drawnCards);
  const actions = buildSuggestedActions(drawnCards, spread);
  const reflection = buildReflectionQuestion(spread, drawnCards);

  const cardListLines = drawnCards
    .map(
      (d) =>
        `- **${d.position.title}:** ${d.card.nameVi} (*${d.card.nameEn}*) — **${d.isReversed ? 'Ngược' : 'Xuôi'}**`
    )
    .join('\n');

  const detailsSection = drawnCards.map((d) => buildCardInterpretation(d, spread)).join('\n\n');

  let md = `### 1. Câu hỏi đã làm rõ\n`;
  md += `- **Câu hỏi gốc:** "${rawQ}"\n`;
  if (wasReframed) {
    md += `- **Gợi ý mở rộng trọng tâm:** *"${clarified}"*\n`;
  }

  if (disclaimers.length > 0) {
    md += `\n${disclaimers.map((n) => `> ${n}`).join('\n>\n')}\n`;
  }

  md += `\n### 2. Kiểu trải bài & Các lá đã rút\n`;
  md += `- **Trải bài:** ${spread.name} (${spread.cardCount} lá)\n`;
  md += `${cardListLines}\n\n`;

  md += `### 3. Luận giải từng lá theo vị trí\n${detailsSection}\n\n`;

  md += `### 4. Mạch chuyện tổng thể\n`;
  md += `${holistic.storyArc}\n`;
  if (holistic.overviewBullets.length > 0) {
    md += `\n${holistic.overviewBullets.map((b) => `- ${b}`).join('\n')}\n`;
  }

  md += `\n### 5. Điểm căng & Điểm sáng\n`;
  md += `- ${holistic.tensionPoint}\n`;
  md += `- ${holistic.opportunityPoint}\n\n`;

  md += `### 6. Gợi ý hành động nhỏ\n${actions.map((a) => `- ${a}`).join('\n')}\n\n`;

  md += `### 7. Câu hỏi tự vấn dành cho bạn\n*${reflection}*\n\n`;

  md += `---\n*8. Nhắc nhẹ: Đây là gợi ý phản chiếu để bạn có thêm góc nhìn; kết quả không phải định mệnh và quyết định cuối cùng luôn thuộc về bạn.*`;

  return { content: md };
}

export function generateBuiltinFollowUp(
  userPrompt: string,
  spread: SpreadDefinition,
  question: string,
  drawnCards: DrawnCard[]
): AgentResult {
  if (isCrisisText(userPrompt)) {
    return { content: getCrisisResponse(), isCrisis: true };
  }

  const lower = userPrompt.toLowerCase();
  const disclaimers = getContextDisclaimers(userPrompt);
  const disclaimerBlock =
    disclaimers.length > 0 ? `${disclaimers.map((d) => `> ${d}`).join('\n')}\n\n` : '';

  const matchedCard = drawnCards.find(
    (d) =>
      lower.includes(d.card.nameEn.toLowerCase()) ||
      lower.includes(d.card.nameVi.toLowerCase())
  );

  if (matchedCard) {
    const { card, position, isReversed } = matchedCard;
    const kw = isReversed ? card.reversed : card.upright;
    return {
      content: `${disclaimerBlock}Phân tích sâu hơn về lá **${card.nameVi} (${card.nameEn})** tại vị trí **${position.title}** (${isReversed ? 'Ngược' : 'Xuôi'}):\n\n- **Nhóm & Nguyên tố:** ${card.arcana === 'major' ? 'Đại Bí' : 'Tiểu Bí'} · ${card.element}${card.astro ? ` · ${card.astro}` : ''}.\n${card.imagery ? `- **Hình ảnh biểu tượng RWS:** ${card.imagery}\n` : ''}- **Trọng tâm ý nghĩa:** ${kw.join(', ')}.\n- **Áp vào câu hỏi:** ${
        isReversed
          ? `Ở thế ngược tại *${position.title}*, lá bài gợi ý năng lượng "${card.upright[0]}" đang tạm chững hoặc đi vào bên trong, cần bạn tháo gỡ khía cạnh "${kw[0]}".`
          : `Ở chiều xuôi tại *${position.title}*, bài gợi ý bạn nắm rõ tinh thần "${kw[0]}" và "${kw[1] ?? kw[0]}".`
      }${card.adviceHint ? `\n- **Lời khuyên của lá:** ${card.adviceHint}` : ''}${card.reflectionQuestion ? `\n- **Câu hỏi gợi mở:** *${card.reflectionQuestion}*` : ''}`,
    };
  }

  if (/hình ảnh|biểu tượng|tranh|vẽ/i.test(lower)) {
    const imageryLines = drawnCards
      .map(
        (d) =>
          `- **${d.card.nameVi}** (*${d.position.title}*): ${d.card.imagery ?? 'Biểu tượng RWS truyền thống của lá bài.'}`
      )
      .join('\n');
    return {
      content: `${disclaimerBlock}Đọc bài theo **hình ảnh biểu tượng Rider-Waite-Smith (RWS)** của trải bài này:\n\n${imageryLines}\n\nBạn thử nhìn xem chi tiết hình ảnh nào khiến bạn chú ý nhất ngay lúc đầu — phản ứng đầu tiên đó thường rất sát với điều bạn đang băn khoăn.`,
    };
  }

  if (/bao lâu|khi nào|thời gian|mấy tháng|mấy tuần|bao giờ/i.test(lower)) {
    const timingBySuit: Record<string, string> = {
      wands: 'Bộ Gậy (Lửa): thường quy ước **vài ngày đến vài tuần** (nhịp nhanh).',
      swords: 'Bộ Kiếm (Khí): thường quy ước **vài ngày đến vài tuần** (chuyển biến nhanh về tư duy/thông tin).',
      cups: 'Bộ Cốc (Nước): thường quy ước **vài tuần đến vài tháng** (cảm xúc cần thời gian lắng).',
      pentacles: 'Bộ Tiền (Đất): thường quy ước **vài tháng đến cả năm** (cần tích lũy thực tế).',
    };
    const suitsPresent = Array.from(
      new Set(drawnCards.map((d) => d.card.suit).filter(Boolean))
    ) as string[];
    const suitNotes =
      suitsPresent.length > 0
        ? suitsPresent.map((s) => `- ${timingBySuit[s]}`).join('\n')
        : '- Trải bài toàn **Đại Bí**, nên mốc chuyển biến gắn với bước ngoặt nhận thức hoặc giai đoạn lớn chứ không cố định theo ngày.';

    return {
      content: `${disclaimerBlock}Tarot **không đo được mốc thời gian chính xác** vì tương lai thay đổi theo hành động của bạn. Theo quy ước truyền thống:\n\n${suitNotes}\n\nThay vì chờ ngày cố định, bạn thử đặt một cột mốc tự kiểm tra sau **7–14 ngày** xem hành động nhỏ mình làm đã tạo thay đổi gì nhé.`,
    };
  }

  if (/ngược|reversed|xấu không/i.test(lower)) {
    const reversedCards = drawnCards.filter((d) => d.isReversed);
    return {
      content: `${disclaimerBlock}Theo hệ thống **TarotByHeu**, **lá ngược không phải điềm xấu**: đó thường là năng lượng đang bị chặn, trì hoãn hoặc hướng vào bên trong.\n\n${
        reversedCards.length > 0
          ? `Các lá ngược trong trải bài gồm: ${reversedCards
              .map((d) => `**${d.card.nameVi}** (${d.position.title})`)
              .join(', ')}. Bạn có thể coi đây là những điểm cần kiên nhẫn tháo gỡ từ nội tâm trước khi hành động ra ngoài.`
          : 'Trải bài này không có lá ngược nào, nghĩa là các yếu tố đang bộc lộ khá trực diện.'
      }`,
    };
  }

  if (/làm gì|hành động|khuyên|cách nào|nên/i.test(lower)) {
    const actions = buildSuggestedActions(drawnCards, spread);
    return {
      content: `${disclaimerBlock}Dựa trên toàn bộ trải bài **${spread.name}** cho câu hỏi *"${question || spread.sampleQuestions[0]}"*, gợi ý hành động cụ thể trong tầm kiểm soát của bạn:\n\n${actions
        .map((a, idx) => `${idx + 1}. ${a}`)
        .join('\n')}\n\nBạn thấy việc nào vừa sức nhất để thử ngay trong tuần này?`,
    };
  }

  const holistic = analyzeHolistic(drawnCards);
  return {
    content: `${disclaimerBlock}**Mạch chuyện & Tổng thể sâu hơn:**\n\n${holistic.storyArc}\n\n- ${holistic.tensionPoint}\n- ${holistic.opportunityPoint}\n${
      holistic.overviewBullets.length > 0
        ? `\n${holistic.overviewBullets.map((b) => `- ${b}`).join('\n')}`
        : ''
    }\n\nBạn có thể hỏi cụ thể về *hình ảnh biểu tượng*, *tên một lá bài*, *hành động tuần này* hoặc *lá ngược* để mình đào sâu thêm nhé.`,
  };
}

const KB_SYSTEM_PROMPT = `Bạn là TarotByHeu Master Agent — người đọc Tarot tài năng, ấm áp, trung thực, dùng bộ Rider-Waite-Smith (RWS) 78 lá.
Bạn dùng Tarot như công cụ phản chiếu và gợi mở suy nghĩ, không phải dự đoán tương lai chắc chắn. Mặc định trả lời bằng tiếng Việt, ngắn gọn, cụ thể, dễ hiểu.

Nguyên tắc bắt buộc:
1. Bài đã được rút bằng bộ sinh số ngẫu nhiên; đọc đúng nghĩa lá và đúng hướng xuôi/ngược, tuyệt đối không bịa nghĩa.
2. Bám sát câu hỏi và bối cảnh người hỏi; kể thành một mạch chuyện nhất quán (storytelling) qua hình ảnh, nguyên tố, tỷ lệ Đại Bí/Tiểu Bí, điểm căng và điểm sáng.
3. Dùng ngôn ngữ xác suất: "bài gợi ý", "có thể", "xu hướng", "bạn thử cân nhắc". Nói rõ chỗ nào là suy diễn.
4. Không dùng cold reading hay câu Barnum chung chung để ra vẻ siêu nhiên.
5. Không khẳng định suy nghĩ thật của người thứ ba, cái chết, bệnh nặng, mang thai, kết quả tài chính/đầu tư, hay pháp lý. Nếu câu hỏi đóng (Có/Không) hoặc về người thứ ba, đề xuất viết lại thành câu hỏi mở tập trung vào người hỏi.
6. Với lá nặng (Death, The Tower, The Devil, Three/Nine/Ten of Swords), luôn giải thích bằng nghĩa ẩn dụ trước; không hù dọa, không tạo lệ thuộc.
7. Nếu có dấu hiệu khủng hoảng (tự hại, tuyệt vọng nặng) hoặc bạo lực gia đình, dừng trải bài, ưu tiên an toàn và khuyến khích tìm hỗ trợ thực tế.
8. Cấu trúc mở đầu theo 8 phần gọn gàng: (1) Câu hỏi đã làm rõ, (2) Kiểu trải bài & danh sách lá, (3) Đọc nhanh từng lá theo vị trí, (4) Mạch chuyện tổng thể, (5) Điểm căng & Điểm sáng, (6) 1–3 gợi ý hành động nhỏ, (7) Câu hỏi tự vấn, (8) Nhắc nhẹ tính tham khảo — quyết định thuộc về người hỏi.`;

function formatSpreadContext(
  spread: SpreadDefinition,
  question: string,
  drawnCards: DrawnCard[]
): string {
  const cardsText = drawnCards
    .map((d) => {
      const kw = (d.isReversed ? d.card.reversed : d.card.upright).join(', ');
      return `- Vị trí "${d.position.title}" (${d.position.description}): ${d.card.nameVi} / ${d.card.nameEn} [${
        d.isReversed ? 'Ngược' : 'Xuôi'
      }] | Nguyên tố: ${d.card.element}${d.card.astro ? ` | Chiêm tinh: ${d.card.astro}` : ''} | Từ khóa: ${kw}${
        d.card.imagery ? ` | Hình ảnh RWS: ${d.card.imagery}` : ''
      }${d.card.adviceHint ? ` | Gợi ý: ${d.card.adviceHint}` : ''}${
        d.card.warning ? ` [Lưu ý lá nặng: ${d.card.warning}]` : ''
      }`;
    })
    .join('\n');

  return `Trải bài: ${spread.name} (${spread.cardCount} lá)
Câu hỏi người dùng: "${question || spread.sampleQuestions[0]}"
Các lá đã rút ngẫu nhiên:
${cardsText}`;
}

async function callGeminiAPI(
  settings: AISettings,
  messages: { role: 'user' | 'model'; text: string }[]
): Promise<string> {
  const model = settings.model.trim() || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(settings.apiKey.trim())}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: KB_SYSTEM_PROMPT }] },
      contents: messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API (${res.status}): ${errText.slice(0, 180)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini API không trả về nội dung.');
  return text;
}

async function callOpenAIAPI(
  settings: AISettings,
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const baseUrl = (settings.baseUrl?.trim() || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const model = settings.model.trim() || 'gpt-4o-mini';

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: KB_SYSTEM_PROMPT }, ...messages],
      temperature: 0.75,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API (${res.status}): ${errText.slice(0, 180)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('API không trả về nội dung.');
  return text;
}

export async function runInitialReading(
  spread: SpreadDefinition,
  question: string,
  drawnCards: DrawnCard[],
  settings: AISettings
): Promise<AgentResult> {
  const cleanQ = question.trim() || spread.sampleQuestions[0];
  if (isCrisisText(cleanQ)) {
    return { content: getCrisisResponse(), isCrisis: true };
  }

  if (settings.mode === 'builtin' || !settings.apiKey.trim()) {
    return generateBuiltinReading(spread, cleanQ, drawnCards);
  }

  const contextPrompt = `${formatSpreadContext(
    spread,
    cleanQ,
    drawnCards
  )}\n\nHãy luận giải chi tiết trải bài này bằng tiếng Việt theo đúng cấu trúc 8 phần và các nguyên tắc trong hệ thống.`;

  try {
    if (settings.mode === 'gemini') {
      const content = await callGeminiAPI(settings, [{ role: 'user', text: contextPrompt }]);
      return { content };
    }
    const content = await callOpenAIAPI(settings, [{ role: 'user', content: contextPrompt }]);
    return { content };
  } catch (err) {
    const fallback = generateBuiltinReading(spread, cleanQ, drawnCards);
    return {
      ...fallback,
      usedFallback: true,
      fallbackReason: err instanceof Error ? err.message : 'Không thể kết nối AI ngoài.',
    };
  }
}

export async function runFollowUpChat(
  userPrompt: string,
  spread: SpreadDefinition,
  question: string,
  drawnCards: DrawnCard[],
  initialReading: string,
  history: ChatMessage[],
  settings: AISettings
): Promise<AgentResult> {
  if (isCrisisText(userPrompt)) {
    return { content: getCrisisResponse(), isCrisis: true };
  }

  if (settings.mode === 'builtin' || !settings.apiKey.trim()) {
    return generateBuiltinFollowUp(userPrompt, spread, question, drawnCards);
  }

  const contextSeed = formatSpreadContext(spread, question, drawnCards);

  try {
    if (settings.mode === 'gemini') {
      const geminiMsgs: { role: 'user' | 'model'; text: string }[] = [
        { role: 'user', text: `${contextSeed}\n\nHãy giải bài chi tiết.` },
        { role: 'model', text: initialReading },
        ...history.map((m) => ({
          role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
          text: m.content,
        })),
        { role: 'user', text: userPrompt },
      ];
      const content = await callGeminiAPI(settings, geminiMsgs);
      return { content };
    }

    const oaiMsgs: { role: 'user' | 'assistant'; content: string }[] = [
      { role: 'user', content: `${contextSeed}\n\nHãy giải bài chi tiết.` },
      { role: 'assistant', content: initialReading },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userPrompt },
    ];
    const content = await callOpenAIAPI(settings, oaiMsgs);
    return { content };
  } catch (err) {
    const fallback = generateBuiltinFollowUp(userPrompt, spread, question, drawnCards);
    return {
      ...fallback,
      usedFallback: true,
      fallbackReason: err instanceof Error ? err.message : 'Không thể kết nối AI ngoài.',
    };
  }
}
