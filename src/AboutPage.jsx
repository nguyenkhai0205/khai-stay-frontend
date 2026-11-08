import { useState } from 'react'
import { getImages } from './imageHelper'

// =====================================================================
// ✏️ SỬA NỘI DUNG Ở ĐÂY — chỉ cần đổi chữ trong khối ABOUT bên dưới
// (Các thông tin dưới đây là NỘI DUNG MẪU, hãy thay bằng thông tin thật)
// =====================================================================
const ABOUT = {
  name: 'Chú Phương_stay',
  tagline: 'Nơi nghỉ dưỡng yên bình bên biển — như ở nhà, nhưng có tiếng sóng.',

  story: [
    'Ba tôi – chú Phương – quê ở Quảng Trị, vùng đất miền Trung nắng gió, nơi người dân gắn bó với biển từ bao đời nay.',
    'Năm 1989, ba tôi cùng gia đình rời quê hương để vào miền Nam lập nghiệp và dừng chân tại Bình Châu. Xa quê để bắt đầu một cuộc sống mới không phải là điều dễ dàng, nhưng gia đình tôi đã chọn Bình Châu làm quê hương thứ hai của mình.',
    'Suốt hơn 40 năm, ba tôi gắn bó với nghề đánh bắt cá mực và hải sản. Những năm tháng trên biển dạy ông sự kiên nhẫn, chịu khó, và biết đọc con nước, đọc thời tiết để chọn đúng lúc ra khơi.',
    'Nhờ từng ấy năm làm nghề, ba tôi hiểu rõ từng mùa cá và biết thế nào là hải sản tươi ngon. Đó cũng là điều chúng tôi muốn chia sẻ với khách: được thưởng thức mực, cá và đặc sản địa phương đúng như cách người dân nơi đây vẫn ăn.',
	'Chúng tôi bắt đầu từ một căn nhà nhỏ gần biển, nơi gia đình thường đón bạn bè về nghỉ ngơi. Từ những lời khen của khách, chúng tôi quyết định mở cửa đón thêm nhiều người đến trải nghiệm.',
    'Chúng tôi mong bạn không chỉ có một nơi ở thoải mái, mà còn được nghe những câu chuyện về biển, về nghề và về mảnh đất đã nuôi lớn gia đình chúng tôi.',
	'Bạn đến với tư cách khách, nhưng mong bạn cảm thấy như người nhà.',
    'Mục tiêu của chúng tôi rất đơn giản: một nơi sạch sẽ, thoải mái, giá hợp lý, và một chủ nhà luôn sẵn lòng chỉ đường, gợi ý món ngon, hoạt động địa phương mà bạn sẽ có những ký ức mãi không phai về làng biển Bình Châu.',
    'Dù bạn đi một mình, đi cùng gia đình hay cùng nhóm bạn, hy vọng bạn sẽ có những ngày thật thư giãn và mang về nhiều kỷ niệm đẹp.',
  ],

  highlights: [
    { icon: '🌊', title: 'Gần biển', text: 'Chỉ vài phút di chuyển đến bãi biển và các điểm tham quan.' },
    { icon: '🧼', title: 'Sạch sẽ', text: 'Phòng được vệ sinh kỹ trước mỗi lượt khách đến.' },
    { icon: '🍲', title: 'Đặc sản địa phương', text: 'Chú Phương và cô Lành sẽ chịu trách nhiệm nấu các mòn ăn địa phương, giúp bạn trãi nghiệm cuộc sống hằng ngày của cư dân Bình Châu. Nếu bạn muốn khám phá những món ăn ở chợ địa phương, chú Phương cô Lành sẽ dẫn đi chợ, hay gợi ý và hỗ trợ đặt các đặc sản, hải sản tươi tại chỗ.' },
    { icon: '💬', title: 'Hỗ trợ nhanh', text: 'Chủ nhà phản hồi qua điện thoại hoặc Zalo trong ngày.' },
  ],

  rules: [
    { icon: '🕑', label: 'Nhận phòng', value: 'Từ 14:00' },
    { icon: '🕛', label: 'Trả phòng', value: 'Trước 12:00' },
    { icon: '🚭', label: 'Hút thuốc', value: 'Không hút thuốc trong không gian kín, như phòng hay nhà' },
    { icon: '🐾', label: 'Thú cưng', value: 'Vui lòng liên hệ trước' },
    { icon: '🔇', label: 'Giờ yên tĩnh', value: 'Sau 21:30' },
    { icon: '🅿️', label: 'Chỗ đậu xe', value: 'Có chỗ đậu xe ô tô miễn phí (tối đa 2 chiếc)' },
  ],

  faqs: [
    { q: 'Tôi có thể hủy hoặc đổi ngày đặt phòng không?', a: 'Bạn có thể liên hệ chúng tôi qua điện thoại hoặc Zalo ít nhất 3 ngày trước ngày nhận phòng để được hỗ trợ đổi hoặc hủy.' },
    { q: 'Làm sao để thanh toán?', a: 'Bạn có thể thanh toán bằng chuyển khoản QR ngân hàng hoặc thanh toán thẻ trực tuyến ngay khi đặt phòng. Đơn sẽ được xác nhận sau khi chúng tôi kiểm tra thanh toán.' },
    { q: 'Homestay có bữa sáng hoặc phục vụ ăn uống không?', a: 'Chúng tôi nấu những món ăn địa phương với chi phí thấp nhât mà vẫn có những trãi nghiệm tuyệt vời. Cũng có thể hỗ trợ đặt đồ ăn, hải sản tươi và đặc sản địa phương theo yêu cầu. Vui lòng báo trước khi đến.' },
    { q: 'Tôi đến sớm hơn giờ nhận phòng thì sao?', a: 'Nếu phòng đã sẵn sàng, chúng tôi sẽ cho bạn nhận phòng sớm. Bạn cũng có thể gửi hành lý tại homestay.' },
    { q: 'Có chỗ cho nhóm đông người không?', a: 'Mỗi căn có số khách tối đa riêng, được ghi rõ trong trang chi tiết. Nếu đi nhóm lớn, hãy liên hệ để chúng tôi tư vấn phương án phù hợp.' },
  ],

  contact: {
    address: 'Ấp Bình Trung, xã Bình Châu, Hồ Chí Minh',   // ✏️ địa chỉ thật
    phone: 'Chú Phương: 03-7698-4946',                                    // ✏️ số điện thoại
    zalo: '0376984946',                                       // ✏️ số Zalo (để trống nếu không dùng)
    email: 'nvkhai.hk10@gmail.com',                              // ✏️ email liên hệ
    facebook: '',                                             // ✏️ link Facebook (để trống nếu không có)
    hours: 'Hỗ trợ mỗi ngày, 7:00 – 21:30',
    mapQuery: 'xã Bình Châu, Hồ Chí Minh',                       // ✏️ từ khóa tìm trên Google Maps
  },
}

// Ảnh tự động lấy từ thư mục: src/assets/images/about/  (không bắt buộc)
const aboutImages = getImages('about')

const card = { backgroundColor: '#f9f9f9', borderRadius: '16px', padding: '24px' }
const h2 = { fontSize: '26px', fontWeight: '700', marginBottom: '16px' }

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '56px' }}>
      <h2 style={h2}>{title}</h2>
      {children}
    </section>
  )
}

function AboutPage({ onBook }) {
  const [openFaq, setOpenFaq] = useState(0)
  const c = ABOUT.contact
  const phoneLink = c.phone ? `tel:${c.phone.replace(/\s/g, '')}` : null

  return (
    <div style={{ marginTop: '40px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>

      {/* ---------- GIỚI THIỆU ĐẦU TRANG ---------- */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>Về {ABOUT.name}</h1>
        <p style={{ fontSize: '18px', color: '#717171', lineHeight: '1.6' }}>{ABOUT.tagline}</p>
      </header>

      {aboutImages.length > 0 && (
        <img
          src={aboutImages[0]}
          alt={ABOUT.name}
          style={{ width: '100%', maxHeight: '460px', objectFit: 'cover', borderRadius: '20px', marginBottom: '48px' }}
        />
      )}

      {/* ---------- CÂU CHUYỆN ---------- */}
      <Section title="📖 Câu chuyện của chúng tôi">
        {ABOUT.story.map((p, i) => (
          <p key={i} style={{ fontSize: '16px', color: '#444', lineHeight: '1.9', marginBottom: '16px' }}>{p}</p>
        ))}
      </Section>

      {/* ---------- ĐIỂM NỔI BẬT ---------- */}
      <Section title="✨ Vì sao chọn chúng tôi">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {ABOUT.highlights.map((h, i) => (
            <div key={i} style={card}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{h.icon}</div>
              <div style={{ fontWeight: '700', marginBottom: '6px' }}>{h.title}</div>
              <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{h.text}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- THƯ VIỆN ẢNH (nếu có nhiều ảnh) ---------- */}
      {aboutImages.length > 1 && (
        <Section title="📷 Hình ảnh">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {aboutImages.slice(1).map((src, i) => (
              <img key={i} src={src} alt={`${ABOUT.name} ${i + 2}`} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px' }} />
            ))}
          </div>
        </Section>
      )}

      {/* ---------- THÔNG TIN & QUY ĐỊNH ---------- */}
      <Section title="🏡 Thông tin & quy định">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          {ABOUT.rules.map((r, i) => (
            <div key={i} style={{ ...card, padding: '16px 20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <span style={{ fontSize: '26px' }}>{r.icon}</span>
              <div>
                <div style={{ fontSize: '13px', color: '#717171' }}>{r.label}</div>
                <div style={{ fontWeight: '600' }}>{r.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- CÂU HỎI THƯỜNG GẶP ---------- */}
      <Section title="❓ Câu hỏi thường gặp">
        <div>
          {ABOUT.faqs.map((f, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e5e5e5' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '18px 4px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#222' }}
              >
                <span>{f.q}</span>
                <span style={{ color: '#FF385C', fontSize: '20px' }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <p style={{ padding: '0 4px 18px', fontSize: '15px', color: '#555', lineHeight: '1.8' }}>{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- LIÊN HỆ ---------- */}
      <Section title="📞 Liên hệ">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={card}>
            <div style={{ fontWeight: '700', marginBottom: '6px' }}>📍 Địa chỉ</div>
            <div style={{ color: '#555', lineHeight: '1.6' }}>{c.address}</div>
          </div>
          {c.phone && (
            <div style={card}>
              <div style={{ fontWeight: '700', marginBottom: '6px' }}>📱 Điện thoại</div>
              <a href={phoneLink} style={{ color: '#FF385C', textDecoration: 'none', fontWeight: '600' }}>{c.phone}</a>
            </div>
          )}
          {c.zalo && (
            <div style={card}>
              <div style={{ fontWeight: '700', marginBottom: '6px' }}>💬 Zalo</div>
              <a href={`https://zalo.me/${c.zalo}`} target="_blank" rel="noreferrer" style={{ color: '#FF385C', textDecoration: 'none', fontWeight: '600' }}>Nhắn tin Zalo</a>
            </div>
          )}
          {c.email && (
            <div style={card}>
              <div style={{ fontWeight: '700', marginBottom: '6px' }}>✉️ Email</div>
              <a href={`mailto:${c.email}`} style={{ color: '#FF385C', textDecoration: 'none', fontWeight: '600', wordBreak: 'break-all' }}>{c.email}</a>
            </div>
          )}
          {c.facebook && (
            <div style={card}>
              <div style={{ fontWeight: '700', marginBottom: '6px' }}>👍 Facebook</div>
              <a href={c.facebook} target="_blank" rel="noreferrer" style={{ color: '#FF385C', textDecoration: 'none', fontWeight: '600' }}>Trang Facebook</a>
            </div>
          )}
          <div style={card}>
            <div style={{ fontWeight: '700', marginBottom: '6px' }}>🕑 Giờ hỗ trợ</div>
            <div style={{ color: '#555' }}>{c.hours}</div>
          </div>
        </div>

        <iframe
          title="Bản đồ"
          src={`https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&output=embed`}
          loading="lazy"
          style={{ width: '100%', height: '320px', border: 0, borderRadius: '16px' }}
        />
      </Section>

      {/* ---------- NÚT ĐẶT PHÒNG ---------- */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <button
          onClick={onBook}
          style={{ padding: '16px 40px', backgroundColor: '#FF385C', color: 'white', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: '700', cursor: 'pointer' }}
        >
          Xem phòng và đặt ngay
        </button>
      </div>
    </div>
  )
}

export default AboutPage
