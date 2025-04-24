import './Footer.scss';
import LogoImage from '../images/footPrint.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <img className="footer-img" src={LogoImage} alt="logoImage" />

        <span className="footer-sec1">
          <strong className="footer-title">Contact Us</strong>
          <div>조원 1 </div>
          <p>이름 : 이영훈</p>
          <p>번호 : 010-5830-5522</p>
          <p>이메일 : ilsame9970@gmail.com</p>


          <div>조원 2 </div>
          <p>이름 : 박대해</p>
          <p>번호 : 010-1234-45546</p>
          <p>이메일 : gdgdgd@gmail.com</p>


        </span>

        <span className="footer-sec2">
          <strong className="footer-title">Contents</strong>
          <Link to="">여행 계획 만들기</Link>
          <Link to="">관광지</Link>
          <Link to="">관광지 코스</Link>
          <Link to="">다른사람의 여행 계획</Link>

        </span>

        <span className="footer-sec3">
          <strong className="footer-title">Connect with Us</strong>
          <Link>로그인</Link>
          <Link>회원가입</Link>
          <Link>카카오톡</Link>
          <Link>네이버</Link>
          <Link>구글</Link>
          <Link>인스타그램</Link>
        </span>

        <span className="footer-sec4">
          <strong className="footer-title"></strong>

        </span>


      </div>
      <div className="footer-bottom">
        <em className="footer-copyright">© 2025 WanderLog. All rights reserved.</em>
      </div>
    </footer>
  );
};

export default Footer;
