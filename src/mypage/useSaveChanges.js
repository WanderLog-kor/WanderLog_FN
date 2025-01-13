import { useCallback } from "react";
import axios from "axios";

const useSaveChanges = ({
  formData,
  setUserData,
  setIsEditing,
  isEmailEditing,
  isAuthCodeVerified,
  setValidationMessages,
  response,
}) => {
  const handleSaveChanges = useCallback(async () => {
    try {
      // 이메일 인증 여부 확인
      if (isEmailEditing && !isAuthCodeVerified) {
        setValidationMessages((prev) => ({
          ...prev,
          email: "이메일 인증을 완료해야 변경할 수 있습니다.",
          emailColor: "validation-error",
        }));
        alert("이메일 인증을 완료해야 변경할 수 있습니다.");
        return;
      }

      // 서버로 변경된 데이터 전송
      await axios.put("http://localhost:9000/user/mypage/userupdate",...formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUserData(response.data.user); // 서버에서 업데이트된 데이터를 설정
        setIsEditing(false); // 수정 모드 종료
      } else {
        alert("정보 저장 실패:", response.data.message);
      }
    } catch (error) {
      alert("정보 저장 중 오류 발생:", error);
    }
  }, [formData, isEmailEditing, isAuthCodeVerified, setValidationMessages, setUserData, setIsEditing]);

  return { handleSaveChanges };
};

export default useSaveChanges;
