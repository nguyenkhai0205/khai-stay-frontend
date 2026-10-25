import { useState, useEffect } from 'react'
import axios from 'axios'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from 'date-fns/locale/vi'; // Import ngôn ngữ Tiếng Việt
import { API_URL } from './config'

function App() {
  // Điều hướng trang: 'home' (Trang chủ), 'login' (Đăng nhập), 'history' (Lịch sử)
  // ✅ New - remembers last tab from localStorage
  const [view, setView] = useState(localStorage.getItem('currentView') || 'home')
  // ✅ Always save view to localStorage when navigating
  const navigateTo = (v) => {
	localStorage.setItem('currentView', v)
	setView(v)
  }
  
  // Quản lý tài khoản
  const [token, setToken] = useState(localStorage.getItem('userToken') || '')
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  
  // Đăng kí tài khoản
  const [isRegisterMode, setIsRegisterMode] = useState(false) // Chuyển đổi qua lại giữa Đăng nhập / Đăng ký
  const [regUser, setRegUser] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')

  // Dữ liệu Homestay & Bộ lọc
  const [homestays, setHomestays] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('Tất cả')

  // Quản lý Form đặt phòng & Thanh toán mô phỏng
  const [selectedHomestay, setSelectedHomestay] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showMethodModal, setShowMethodModal] = useState(false)  // ← ADD this new one
  const [tempBookingData, setTempBookingData] = useState(null)
  const [message, setMessage] = useState('')
  
  // Dữ liệu lịch sử
  const [history, setHistory] = useState([])
  // State lưu danh sách ngày bận dạng ['2026-05-27', '2026-05-28']
  const [disabledDates, setDisabledDates] = useState([])
  
  //Tìm kiếm thông minh theo từ khóa (Search Bar)
  const [searchKeyword, setSearchKeyword] = useState('')
  
  //Experience and Specialty
  const [selectedActivity, setSelectedActivity] = useState(null) // null = list, object = detail page
  const [selectedFood, setselectedFood] = useState(null) // null = list, object = detail page
  
  useEffect(() => {
    axios.get(`${API_URL}/api/homestays/`)
      .then(res => {
        setHomestays(res.data)
        setLoading(false)
        if(res.data.length > 0) {
          setSelectedHomestay(res.data[0].id)
          fetchBookedDates(res.data[0].id) // Tải lịch bận cho phòng mặc định đầu tiên
        }
      })
      .catch(() => setLoading(false))
  }, [])

  //Add your activities data 
  const activities = [
	{
		id: 1,
		title: "Lặn biển Côn Đảo",
		mainImage: "/images/activities/diving/diving.jpg",
		description: "Khám phá thế giới đại dương tuyệt đẹp tại Côn Đảo với làn nước trong xanh.",
		images: [
			"/images/activities/diving/diving1.jpg",
			"/images/activities/diving/diving2.jpg",
			"/images/activities/diving/diving3.jpg",
		],
		details: `Lặn biển tại Côn Đảo là trải nghiệm không thể bỏ qua...
		Thời gian: 6:00 - 12:00
		Giá: 500.000 VNĐ/người
		Bao gồm: Hướng dẫn viên, thiết bị lặn, nước uống.`
	},
	{
		id: 2,
		title: "Kayak sông nước",
		mainImage: "/images/activities/kayak/kayak.jpg",
		description: "Chèo thuyền kayak khám phá hệ thống sông ngòi miền Tây thơ mộng.",
		images: [
			"/images/activities/kayak/kayak1.jpg",
			"/images/activities/kayak/kayak2.jpg",
		],
		details: `Trải nghiệm chèo kayak độc đáo trên dòng sông hiền hòa...
		Thời gian: 7:00 - 11:00
		Giá: 300.000 VNĐ/người`
	},
	{
		id: 3,
		title: "Leo núi Bà Đen",
		mainImage: "/images/activities/hiking/hiking.jpg",
		description: "Chinh phục đỉnh núi Bà Đen hùng vĩ, ngắm toàn cảnh Tây Ninh từ trên cao.",
		images: [
			"/images/activities/hiking/hiking1.jpg",
			"/images/activities/hiking/hiking2.jpg",
		],
		details: `Hành trình leo núi Bà Đen đầy thử thách và thú vị...
		Thời gian: 5:00 - 14:00
		Giá: 200.000 VNĐ/người`
	},
	// ✏️ Add more activities here following the same structure
  ]
  
  //Add your specialties products 
  const foods = [
	{
		id: 1,
		title: "Cá chỉ vàng tẩm khô",
		mainImage: "/images/specialties/1_cachivangkho/cachivangkho.jpg",
		description: "Cá chỉ vàng tẩm khô mặn mà hương thơm và gia vị biển Bình Châu.",
		images: [
			"/images/specialties/1_cachivangkho/cachivangkho1.jpg",
			"/images/specialties/1_cachivangkho/cachivangkho2.jpg",
			"/images/specialties/1_cachivangkho/cachivangkho3.jpg",
		],
		details: `Cá chỉ vàng tẩm khô mặn mà hương thơm và gia vị biển Bình Châu...
		Giá: 200.000 VNĐ/kg
		Bao gồm: Đóng gói và hút chân không.`
	},
	{
		id: 2,
		title: "Cá chim trắng biển",
		mainImage: "/images/specialties/2_cachimtrang/cachimtrang.jpg",
		description: "Cá chim trắng biển béo và thơm ngon cho bữa cơm gia đình thêm ngọt ngào.",
		images: [
			"/images/specialties/2_cachimtrang/cachimtrang1.jpg",
			"/images/specialties/2_cachimtrang/cachimtrang2.jpg",
		],
		details: `Cá chim trắng biển béo và thơm ngon cho bữa cơm gia đình thêm ngọt ngào...
		Giá: 300.000 VNĐ/kg
		Bao gồm: Đóng gói và hút chân không.`
	},
	{
		id: 3,
		title: "Mực một nắng",
		mainImage: "/images/specialties/3_mucmotnang/mucmotnang.jpg",
		description: "Nếm thử mực một nắng và làm quà cho bà con và bạn bè.",
		images: [
			"/images/specialties/3_mucmotnang/mucmotnang1.jpg",
			"/images/specialties/3_mucmotnang/mucmotnang2.jpg",
		],
		details: `Mực một nắng Bình Châu...
		Giá: 600.000 VNĐ/kg
		Bao gồm: Đóng gói và hút chân không.`
	},
	// ✏️ Add more foods here following the same structure
  ]

  // Thay đổi phòng được chọn
  const handleHomestayChange = (id) => {
    setSelectedHomestay(id)
    fetchBookedDates(id) // Tải lại lịch bận cho phòng mới
  }
  
  // Hàm gọi lịch sử đặt phòng
  const fetchHistory = () => {
    if (!token) return
    axios.get(`${API_URL}/api/history/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(res => setHistory(res.data))
    .catch(err => console.error("Lỗi khi lấy lịch sử đặt phòng:", err))
  }
  
  // Hàm tải ngày bận của phòng được chọn
  const fetchBookedDates = (homestayId) => {
    if (!homestayId) return
    axios.get(`${API_URL}/api/homestays/${homestayId}/booked-dates/`)
      .then(res => setDisabledDates(res.data.booked_dates))
      .catch(err => console.error("Lỗi lấy ngày bận:", err))
  }
  
  useEffect(() => {
    if (view === 'history') fetchHistory()
  }, [view])

  // Xử lý Đăng nhập
  const handleLogin = (e) => {
    e.preventDefault()
    axios.post(`${API_URL}/api/login/`, { username: loginUser, password: loginPass })
      .then(res => {
        setToken(res.data.token)
        setUsername(res.data.username)
        localStorage.setItem('userToken', res.data.token)
        localStorage.setItem('username', res.data.username)
        localStorage.setItem('isAdmin', res.data.is_superuser ? 'true' : 'false') // Lưu thông tin Admin
        navigateTo('home')
        setMessage('🔓 Đăng nhập thành công!')
      })
      .catch(() => alert('Sai tài khoản hoặc mật khẩu rồi bạn ơi!'))
  }

  // Đăng xuất
  const handleLogout = () => {
    setToken('')
    setUsername('')
    localStorage.clear()
    navigateTo('home')
  }
  
  // Handle checkin change
  const handleCheckInChange = (e) => {
    const selectedDate = e.target.value
    if (disabledDates.includes(selectedDate)) {
      alert("⚠️ Ngày này đã có người đặt mất rồi! Vui lòng chọn ngày khác.")
      setCheckIn('')
    } else {
      setCheckIn(selectedDate)
    }
  }

  const handleCheckOutChange = (e) => {
    const selectedDate = e.target.value
    if (disabledDates.includes(selectedDate)) {
      alert("⚠️ Ngày này trùng vào lịch bận của phòng! Vui lòng chọn ngày khác.")
      setCheckOut('')
    } else {
      setCheckOut(selectedDate)
    }
  }
  
  // Đăng kí tài khoản
  const handleRegister = (e) => {
    e.preventDefault()
    axios.post(`${API_URL}/api/register/`, {
      username: regUser,
      password: regPass,
      first_name: regFirstName,  // 🎯 Gửi Họ tên lên backend
	  last_name: regLastName,
      email: regEmail,      // 🎯 Gửi Email lên backend
      phone: regPhone       // 🎯 Gửi Số điện thoại lên backend
    })
    .then(res => {
      alert('Đăng ký thành công! Hãy đăng nhập.')
      setIsRegisterMode(false) // Chuyển về màn hình đăng nhập
      setRegUser('')
      setRegPass('')
      // 🎯 Xóa trắng các ô nhập liệu mới
	  setRegFirstName('')
      setRegLastName('')
      setRegEmail('')
      setRegPhone('')
    })
    .catch(err => {
      alert(err.response?.data?.error || 'Đăng ký thất bại!')
    })
  }
  
  // Cập nhật trạng thái đơn hàng của Admin
  const handleAdminUpdate = (bookingId, statusValue) => {
    axios.post(`${API_URL}/api/bookings/${bookingId}/update/`, { status: statusValue }, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(() => {
      alert("Đã cập nhật trạng thái đơn hàng thành công!");
      fetchHistory(); // Tải lại danh sách lịch sử mới nhất
    })
    .catch(err => alert(err.response?.data?.error || "Gặp lỗi khi xử lý."));
  }
  
  // Bước 1 đặt phòng: Bấm đặt phòng -> Hiện cổng thanh toán mô phỏng
  const triggerPaymentStep = (e) => {
    e.preventDefault()
    if (!token) {
      alert('Vui lòng Đăng nhập trước khi tiến hành đặt phòng!')
      navigateTo('login')
      return
    }
    // Logic chặn đặt nếu trùng ngày bận
    if (disabledDates.includes(checkIn) || disabledDates.includes(checkOut)) {
      alert('⚠️ Khoảng thời gian bạn chọn có ngày đã được đặt trước. Vui lòng kiểm tra lại!')
      return
    }

    const currentRoom = homestays.find(h => h.id == selectedHomestay)
	
	// ✅ Calculate price locally so it shows immediately in the modal
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    const estimatedPrice = nights * parseFloat(currentRoom?.price_per_night || 0)
  
    setTempBookingData({
      homestay: selectedHomestay,
      title: currentRoom?.title,
      check_in: checkIn,
      check_out: checkOut,
	  total_price: estimatedPrice,  // ✅ Price now available before API call
      id: null                       // ✅ Will be filled after booking saved
    })
    setShowMethodModal(true)
  }

  // Bước 2a: Chọn QR → mở modal QR cũ
  const handleChooseQR = () => {
    setShowMethodModal(false)
    setShowPaymentModal(true)  // ← this opens the existing QR modal
  }

  // Bước 2b: Chọn Credit Card → gọi PayOS
  const handleChooseCard = async () => {
    setShowMethodModal(false)
    try {
      const res = await axios.post(`${API_URL}/api/create-payos-payment/`, {
        homestay: tempBookingData.homestay,
        check_in: tempBookingData.check_in,
        check_out: tempBookingData.check_out,
      }, {
        headers: { 'Authorization': `Token ${token}` }
      })
      window.location.href = res.data.checkout_url
    } catch (err) {
      alert(err.response?.data?.error || 'Không thể tạo link thanh toán!')
    }
  }

  // Bước 2: Xác nhận thanh toán thành công (Mô phỏng cổng ngân hàng)
  const confirmPaymentAndBook = (status) => {
    const finalData = { ...tempBookingData, payment_status: status }
    
    axios.post(`${API_URL}/api/bookings/`, finalData, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(res => {
	  // ✅ Update tempBookingData with real ID from server for QR display
      setTempBookingData(prev => ({ ...prev, id: res.data.id, total_price: res.data.total_price }))
      setShowPaymentModal(false)
      setMessage(`🎉 Đặt phòng & Thanh toán thành công! Mã đơn: #${res.data.id}`)
      setCheckIn('')
      setCheckOut('')
    })
    .catch(() => {
      alert('Có lỗi xảy ra khi lưu đơn đặt phòng!')
    })
  }

  const cities = ['Tất cả', ...new Set(homestays.map(item => item.city))]
  const filteredHomestays = homestays.filter(item => {
    const matchCity = selectedCity === 'Tất cả' || item.city === selectedCity
    const matchKeyword = item.title.toLowerCase().includes(searchKeyword.toLowerCase())
    return matchCity && matchKeyword
  })

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #FF385C', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <div style={{ fontSize: '16px', fontWeight: '600', color: '#717171' }}>⌛ Đang tải dữ liệu khai_stay...</div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", padding: '0 80px', backgroundColor: '#ffffff', minHeight: '100vh', position: 'relative' }}>
      
      {/* THANH ĐẦU TRANG (HEADER) */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f2f2f2', marginBottom: '20px' }}>
        <div style={{ fontSize: '24px', fontWeight: '800', color: '#FF385C', cursor: 'pointer' }} onClick={() => navigateTo('home')}>
          🔴 khai_stay
        </div>
        
        {/* THANH MENU ĐIỀU HƯỚNG CHỨC NĂNG MỚI */}
		<div style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: '600', color: '#222222' }}>
			<span style={{ cursor: 'pointer', color: view === 'home' ? '#FF385C' : '#222222' }} onClick={() => navigateTo('home')}>Nơi ở</span>
			<span style={{ cursor: 'pointer', color: view === 'experience' ? '#FF385C' : '#222222' }} onClick={() => navigateTo('experience')}>Trải nghiệm</span>
			<span style={{ cursor: 'pointer', color: view === 'specialty' ? '#FF385C' : '#222222' }} onClick={() => navigateTo('specialty')}>Đặc sản</span>
			{token && <span style={{ cursor: 'pointer', color: view === 'history' ? '#FF385C' : '#222222' }} onClick={() => navigateTo('history')}>Lịch sử đặt</span>}
		</div>
		
		{/* Menu  */}
		<div style={{ border: '1px solid #dddddd', padding: '8px 16px', borderRadius: '21px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#ffffff', boxShadow: '0px 1px 2px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
          Menu ☰
        </div>

        {/* CỤM TÀI KHOẢN ĐĂNG NHẬP / ĐĂNG XUẤT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {token ? (
            <>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>👋 {username}</span>
              <button onClick={handleLogout} style={{ border: '1px solid #dddddd', borderRadius: '21px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#f7f7f7' }}>Đăng xuất</button>
            </>
          ) : (
            <button onClick={() => navigateTo('login')} style={{ border: '1px solid #FF385C', borderRadius: '21px', padding: '8px 16px', fontSize: '14px', fontWeight: '600', color: '#ffffff', backgroundColor: '#FF385C', cursor: 'pointer' }}>Đăng nhập</button>
          )}
        </div>
      </header>

      {/* RENDER THEO BIẾN ĐIỀU HƯỚNG VIEW */}
      
	  {/* ---------------- 1. VIEW ĐĂNG NHẬP / ĐĂNG KÝ ---------------- */}
      {view === 'login' && (
        <div style={{ maxWidth: '400px', margin: '80px auto', padding: '32px', border: '1px solid #dddddd', borderRadius: '16px', boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}>
          {!isRegisterMode ? (
            <>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>Chào mừng bạn đến với khai_stay</h2>
              <form onSubmit={handleLogin}>
                <input type="text" placeholder="Tên đăng nhập (Admin hoặc User)" value={loginUser} onChange={e => setLoginUser(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                <input type="password" placeholder="Mật khẩu" value={loginPass} onChange={e => setLoginPass(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#FF385C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Đăng nhập ngay</button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>Chưa có tài khoản? <span style={{ color: '#FF385C', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsRegisterMode(true)}>Đăng ký tài khoản mới</span></p>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>Đăng ký thành viên mới</h2>
              <form onSubmit={handleRegister}>
                
                {/* 🎯 BỔ SUNG: Ô nhập Họ và Tên */}
				<div style={{ display: 'flex', gap: '12px', marginBottom: '16px', width: '100%', boxSizing: 'border-box'}}>
                  <input 
                    type="text" 
                    placeholder="Họ (VD: Nguyễn)" 
                    value={regLastName} 
                    onChange={e => setRegLastName(e.target.value)} 
                    required 
                    style={{ flex: 1, width: '0', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                  />
                  <input 
                    type="text" 
                    placeholder="Đệm và Tên (VD: Minh An)" 
                    value={regFirstName} 
                    onChange={e => setRegFirstName(e.target.value)} 
                    required 
                    style={{ flex: 1, width: '0', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                  />
                </div>
                
                {/* 🎯 BỔ SUNG: Ô nhập Email */}
                <input 
                  type="email" 
                  placeholder="Nhập địa chỉ email (VD: abc@gmail.com)" 
                  value={regEmail} 
                  onChange={e => setRegEmail(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                />

                {/* 🎯 BỔ SUNG: Ô nhập Số điện thoại */}
                <input 
                  type="tel" 
                  placeholder="Nhập số điện thoại" 
                  value={regPhone} 
                  onChange={e => setRegPhone(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                />

                {/* Giữ nguyên ô nhập Username cũ */}
                <input type="text" placeholder="Nhập tên đăng nhập muốn tạo" value={regUser} onChange={e => setRegUser(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                
                {/* Giữ nguyên ô nhập Password cũ */}
                <input type="password" placeholder="Nhập mật khẩu bảo mật" value={regPass} onChange={e => setRegPass(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                
                <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Tạo tài khoản</button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>Đã có tài khoản? <span style={{ color: '#FF385C', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsRegisterMode(false)}>Quay lại Đăng nhập</span></p>
            </>
          )}
        </div>
      )}
	  
      {/* ---------------- 2. VIEW LỊCH SỬ ĐẶT PHÒNG ---------------- */}
      {view === 'history' && (
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>📅 Lịch sử đặt phòng của bạn</h2>
          {history.length === 0 ? <p style={{ color: '#717171' }}>Bạn chưa đặt căn phòng nào cả!</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7f7f7', borderBottom: '2px solid #dddddd', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Mã đơn</th>
                  <th style={{ padding: '12px' }}>Tên Homestay</th>
                  <th style={{ padding: '12px' }}>Ngày nhận</th>
                  <th style={{ padding: '12px' }}>Ngày trả</th>
                  <th style={{ padding: '12px' }}>Trạng thái thanh toán</th>
				  <th style={{ padding: '12px' }}>Vận hành (Admin)</th>
                </tr>
              </thead>
              <tbody>
                {history.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: '600' }}>#{b.id}</td>
                    <td style={{ padding: '12px' }}>{b.homestay_title || `Phòng số ${b.homestay}`}</td>
                    <td style={{ padding: '12px' }}>{b.check_in}</td>
                    <td style={{ padding: '12px' }}>{b.check_out}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', backgroundColor: b.payment_status === 'PAID' ? '#DEF7EC' : '#FEF08A', color: b.payment_status === 'PAID' ? '#03543F' : '#713F12' }}>
                        {b.payment_status === 'PAID' ? '✅ Đã thanh toán' : '⏳ Chờ xử lý'}
                      </span>
                    </td>
					<td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '13px', backgroundColor: b.status === 'confirmed' ? '#D1FAE5' : b.status === 'cancelled' ? '#FEE2E2' : '#F3F4F6', color: b.status === 'confirmed' ? '#065F46' : b.status === 'cancelled' ? '#991B1B' : '#374151', marginRight: '8px' }}>
                        {b.status === 'confirmed' ? 'Đã duyệt' : b.status === 'cancelled' ? 'Đã hủy' : 'Đang xử lý'}
                      </span>
                      {localStorage.getItem('isAdmin') === 'true' && b.status === 'pending' && (
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button onClick={() => handleAdminUpdate(b.id, 'confirmed')} style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Duyệt</button>
                          <button onClick={() => handleAdminUpdate(b.id, 'cancelled')} style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Hủy đơn</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ---------------- 3. VIEW TRANG CHỦ (GIỮ NGUYÊN GRID VÀ FORM CỦA BẠN) ---------------- */}
      {view === 'home' && (
        <>
		  {/* THANH LỌC THÀNH PHỐ & Ô TÌM KIẾM */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {cities.map(city => (
                <button key={city} onClick={() => setSelectedCity(city)} style={{ padding: '10px 20px', borderRadius: '20px', border: selectedCity === city ? '2px solid #222222' : '1px solid #dddddd', backgroundColor: selectedCity === city ? '#222222' : '#ffffff', color: selectedCity === city ? '#ffffff' : '#717171', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  {city === 'Tất cả' ? '🌍 Tất cả khu vực' : `📍 ${city}`}
                </button>
              ))}
            </div>
            
            <input 
              type="text" 
              placeholder="🔍 Nhập tên phòng cần tìm..." 
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: '20px', border: '1px solid #dddddd', width: '280px', outline: 'none', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '40px', alignItems: 'start' }}>
            {/* GRID HIỂN THỊ PHÒNG */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#222222', marginBottom: '20px' }}>🏠 Chỗ ở tại {selectedCity}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {filteredHomestays.map(item => (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column', cursor: item.is_available ? 'pointer' : 'not-allowed', opacity: item.is_available ? 1 : 0.5 }} onClick={() => item.is_available && setSelectedHomestay(item.id)}>
                    <div style={{ width: '100%', height: '200px', marginBottom: '12px', overflow: 'hidden', borderRadius: '12px', position: 'relative' }}>
                      {!item.is_available && <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#EA580C', color: '#white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>🚫 HẾT PHÒNG</div>}
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0].image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : <div style={{ width: '100%', height: '100%', backgroundColor: '#e4e4e4' }}>🖼️ Không có ảnh</div>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '15px' }}>
                      <span>{item.title}</span>
                      <span>★ 4.95</span>
                    </div>
                    <div style={{ color: '#717171', fontSize: '14px', marginTop: '4px' }}>Thành phố: {item.city}</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '6px' }}>{parseFloat(item.price_per_night).toLocaleString('vi-VN')} VND/đêm</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM ĐẶT PHÒNG */}
            <div style={{ width: '380px', position: 'sticky', top: '40px' }}>
              <div style={{ border: '1px solid #dddddd', borderRadius: '24px', padding: '24px', boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', width: '100%', boxSizing: 'border-box'}}>Đặt phòng</h3>
                <form onSubmit={triggerPaymentStep}>
                  <div style={{ border: '1px solid #b0b0b0', borderRadius: '8px', marginBottom: '16px', padding: '10px' }}>
                    {/* Sửa ô select phòng */}
					<select value={selectedHomestay} onChange={e => handleHomestayChange(e.target.value)} style={{ width: '100%', border: 'none', outline: 'none' }}>
						{homestays.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
					</select>
				  </div>
				  {/* Sửa cụm chọn ngày */}
				  <div style={{ display: 'flex', border: '1px solid #b0b0b0', borderRadius: '8px', marginBottom: '20px' }}>
					<input type="date" value={checkIn} onChange={handleCheckInChange} required style={{ flex: 1, width: '0', padding: '10px', borderRight: '1px solid #b0b0b0', border: 'none' }} />
					<input type="date" value={checkOut} onChange={handleCheckOutChange} required style={{ flex: 1, width: '0', padding: '10px', border: 'none' }} />
				  </div>
                  <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                    Xác nhận Đặt phòng ngay
                  </button>
                </form>
                {message && <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f7f7f7', borderRadius: '8px', fontSize: '14px' }}>{message}</div>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ---------------- 4. MODAL CỔNG THANH TOÁN MÔ PHỎNG VNGATEWAY ---------------- */}
	  {/* MODAL CHỌN PHƯƠNG THỨC THANH TOÁN */}
	  {showMethodModal && (
		<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
		  <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '20px', width: '420px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', textAlign: 'center' }}>
			<h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E3A8A', marginBottom: '8px' }}>💳 Chọn phương thức thanh toán</h2>
			<p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
			  Tổng tiền: <strong style={{ color: '#FF385C' }}>{Number(tempBookingData?.total_price).toLocaleString('vi-VN')} VNĐ</strong>
			</p>

			<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
			  <button onClick={handleChooseQR} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>
				<span style={{ fontSize: '28px' }}>📱</span>
				<div style={{ textAlign: 'left' }}>
				  <div>Chuyển khoản QR</div>
				  <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '400' }}>Quét mã VietQR qua app ngân hàng</div>
				</div>
			  </button>

			  <button onClick={handleChooseCard} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', border: '2px solid #6366F1', borderRadius: '12px', backgroundColor: '#EEF2FF', cursor: 'pointer', fontSize: '15px', fontWeight: '600', color: '#4338CA' }}>
				<span style={{ fontSize: '28px' }}>💳</span>
				<div style={{ textAlign: 'left' }}>
				  <div>Thẻ tín dụng / Thẻ ATM</div>
				  <div style={{ fontSize: '12px', color: '#818CF8', fontWeight: '400' }}>Thanh toán qua cổng PayOS an toàn</div>
				</div>
			  </button>
			</div>

			<button onClick={() => setShowMethodModal(false)} style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Hủy bỏ</button>
		  </div>
		</div>
	  )}

	  {/* --- MODAL THANH TOÁN THỰC TẾ --- */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '20px', width: '450px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>💳 CỔNG THANH TOÁN KHAI_PAY</h2>
            <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '20px' }}>Bạn đang thực hiện thanh toán cho chỗ ở: <br/><strong>{tempBookingData?.title}</strong></p>
            
            {/* Giả lập mã QR chuyển khoản ngân hàng */}
			{tempBookingData && (
			  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
				{/* 🎯 TỰ ĐỘNG SINH MÃ QR THỰC TẾ THEO SỐ TIỀN VÀ MÃ ĐƠN HÀNG */}
				<img 
				  src={`https://img.vietqr.io/image/VietcomBank-0721000610796-compact2.png?amount=${tempBookingData.total_price}&addInfo=DH${tempBookingData.id}&accountName=NGUYEN%20VIET%20KHAI`}
				  alt="Mã QR Thanh Toán Ngân Hàng"
				  style={{ width: '220px', height: '220px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '10px', backgroundColor: '#fff' }}
				/>
    
				<div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px' }}>
				  <p style={{ margin: '4px 0' }}>Chủ tài khoản: <strong>NGUYEN VIET KHAI</strong></p>
				  <p style={{ margin: '4px 0' }}>Số tiền: <strong style={{ color: '#FF385C' }}>{Number(tempBookingData.total_price).toLocaleString('vi-VN')} VNĐ</strong></p>
				  <p style={{ margin: '4px 0' }}>Nội dung bắt buộc: <strong style={{ color: '#10B981' }}>DH{tempBookingData.id}</strong></p>
				</div>
			  </div>
			)}	

            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>Vui lòng chọn trạng thái mô phỏng thanh toán của bạn để hoàn tất lưu đơn hàng:</p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => confirmPaymentAndBook('PAID')} style={{ padding: '12px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>✔️ Thành công</button>
              <button onClick={() => setShowPaymentModal(false)} style={{ padding: '12px 20px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>❌ Hủy bỏ</button>
            </div>
          </div>
        </div>
      )}
	  

	  {/* ---------------- EXPERIENCE VIEW - ACTIVITY LIST ---------------- */}
	  {view === 'experience' && !selectedActivity && (
		<div style={{ marginTop: '40px' }}>
			<h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>🌿 Trải nghiệm</h2>
			<p style={{ color: '#717171', fontSize: '15px', marginBottom: '32px' }}>Khám phá các hoạt động thú vị tại điểm đến của bạn</p>

			{/* CARD GRID */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
				{activities.map(activity => (
					<div
						key={activity.id}
						onClick={() => setSelectedActivity(activity)}
						style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s', }}
						onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
						onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
					>
						{/* Main image */}
						<div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
							<img
								src={activity.mainImage}
								alt={activity.title}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</div>
						{/* Card info */}
						<div style={{ padding: '16px' }}>
							<h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{activity.title}</h3>
							<p style={{ fontSize: '14px', color: '#717171', lineHeight: '1.5' }}>{activity.description}</p>
							<span style={{ display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: '#FF385C' }}>Xem chi tiết →</span>
						</div>
					</div>
				))}
			</div>
		</div>
	  )}

	  {/* ---------------- EXPERIENCE VIEW - ACTIVITY DETAIL ---------------- */}
	  {view === 'experience' && selectedActivity && (
		<div style={{ marginTop: '40px', maxWidth: '900px', margin: '40px auto' }}>

			{/* Back button */}
			<button
				onClick={() => setSelectedActivity(null)}
				style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', color: '#222', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}
			>
				← Quay lại Trải nghiệm
			</button>

			{/* Title */}
			<h2 style={{ fontSize: '30px', fontWeight: '800', marginBottom: '20px' }}>{selectedActivity.title}</h2>

			{/* Main image */}
			<img
				src={selectedActivity.mainImage}
				alt={selectedActivity.title}
				style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }}
			/>

			{/* Extra images gallery */}
			{selectedActivity.images.length > 0 && (
				<div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedActivity.images.length}, 1fr)`, gap: '12px', marginBottom: '28px' }}>
					{selectedActivity.images.map((img, i) => (
						<img
							key={i}
							src={img}
							alt={`${selectedActivity.title} ${i + 1}`}
							style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }}
						/>
					))}
				</div>
			)}

			{/* Description & details */}
			<div style={{ backgroundColor: '#f9f9f9', borderRadius: '16px', padding: '24px' }}>
				<h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Mô tả hoạt động</h3>
				<p style={{ fontSize: '15px', color: '#444', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
					{selectedActivity.details}
				</p>
			</div>

		</div>
	  )}

	  {/* ---------------- Specialty VIEW - SPECIALTY LIST ---------------- */}
	  {view === 'specialty' && !selectedFood && (
		<div style={{ marginTop: '40px' }}>
			<h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>🌿 Đặc sản</h2>
			<p style={{ color: '#717171', fontSize: '15px', marginBottom: '32px' }}>Nếm thử những món đặc sản tại điểm đến của bạn</p>

			{/* CARD GRID */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
				{foods.map(food => (
					<div
						key={food.id}
						onClick={() => setselectedFood(food)}
						style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s', }}
						onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
						onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
					>
						{/* Main image */}
						<div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
							<img
								src={food.mainImage}
								alt={food.title}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</div>
						{/* Card info */}
						<div style={{ padding: '16px' }}>
							<h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{food.title}</h3>
							<p style={{ fontSize: '14px', color: '#717171', lineHeight: '1.5' }}>{food.description}</p>
							<span style={{ display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: '#FF385C' }}>Xem chi tiết →</span>
						</div>
					</div>
				))}
			</div>
		</div>
	  )}

	  {/* ---------------- Specialty VIEW - SPECIALTY DETAIL ---------------- */}
	  {view === 'specialty' && selectedFood && (
		<div style={{ marginTop: '40px', maxWidth: '900px', margin: '40px auto' }}>

			{/* Back button */}
			<button
				onClick={() => setselectedFood(null)}
				style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', color: '#222', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}
			>
				← Quay lại Đặc sản
			</button>

			{/* Title */}
			<h2 style={{ fontSize: '30px', fontWeight: '800', marginBottom: '20px' }}>{selectedFood.title}</h2>

			{/* Main image */}
			<img
				src={selectedFood.mainImage}
				alt={selectedFood.title}
				style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }}
			/>

			{/* Extra images gallery */}
			{selectedFood.images.length > 0 && (
				<div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedFood.images.length}, 1fr)`, gap: '12px', marginBottom: '28px' }}>
					{selectedFood.images.map((img, i) => (
						<img
							key={i}
							src={img}
							alt={`${selectedFood.title} ${i + 1}`}
							style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }}
						/>
					))}
				</div>
			)}

			{/* Description & details */}
			<div style={{ backgroundColor: '#f9f9f9', borderRadius: '16px', padding: '24px' }}>
				<h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Mô tả hoạt động</h3>
				<p style={{ fontSize: '15px', color: '#444', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
					{selectedFood.details}
				</p>
			</div>

		</div>
	  )}
	  
    </div>
  )
}

export default App