import { useState, useEffect, useRef } from "react";
import PlannerDate from "../PlannerDate/PlannerDate";
import axios from "axios";
import "./SideBar.scss";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../images/logoImage.png";
import NoImage from "../../images/noImage.png";
import Search from "../../images/search.png";
import Delete from "../../images/delete.png";
import Modal from "./Modal";
import { useLoginStatus } from "../../auth/PrivateRoute";

const SideBar = (props) => {
  // console.log("sibebarSelectedCity",props);
  //주석 처리한 부분은 삭제 예정 코드.
  const { loginStatus } = useLoginStatus();
  const [isModalOpen, setIsModalOpen] = useState(false); //모달 오픈 상태
  const [plannerTitle, setPlannerTitle] = useState(loginStatus ? 
    (`${props.loginData.username}님의 여행계획`) : ("Guest 님의 여행계획")); //제목

  const [plannerDescription, setPlannerDescription] = useState(loginStatus ? 
    (`${props.loginData.username} 님이 계획하신 여행계획입니다.`) : ("Guest 님이 계획하신 여행계획입니다.")); //내용

  const [addedItemsByDay, setAddedItemsByDay] = useState({}); //각 N일차에 대한 요소 추가 여부
  const [isPlannerVisible, setIsPlannerVisible] = useState(true);
  const [cardAdded, setCardAdded] = useState(false);
  // console.log("시발",props);
  const togglePlannerVisibility = () => {
    //플래너 부분 들어갔다 나오게 하기
    setIsPlannerVisible(!isPlannerVisible);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const isMounted = useRef(false);
  const isMountedSearch = useRef(false);
  const updateData = { ...location.state };
  const bringData = { ...location.state };
  const [plannerID, setPlannerID] = useState(0);

  const [dateState, setDateState] = useState(true);
  const [listState, setListState] = useState(true);

  const [day, setDay] = useState(0);
  const [area, setArea] = useState();
  const [selectedDay, setSelectedDay] = useState(1);
  const [isPublic, setIsPublic] = useState(false);

  const [word, setWord] = useState("");
  const [search, setSearch] = useState([]);
  const [typeState, setTypeState] = useState("관광지");
  const [areaName, setAreaName] = useState(null);
  const [areaCode, setAreaCode] = useState();

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [resultsPerPage] = useState(10); // 한 페이지에 표시할 결과 수
  const [pagesToShow] = useState(5); // 한 번에 표시할 페이지 번호 개수

  // 몇박인지 저장
  const handleDate = (start, end) => {
    const startDay = new Date(start);
    const endDay = new Date(end);
    return Math.ceil((endDay - startDay) / (1000 * 60 * 60 * 24) + 1); //하루를 포함;
  };

  useEffect(() => {
    const calculatedDay = handleDate(props.startDate, props.endDate);
    setDay(calculatedDay);
  });

  useEffect(()=>{
    if(props.destination) {

      const initializedItems = {};
      props.destination.forEach((dest)=>{
        if(!initializedItems[dest.day]) {
          initializedItems[dest.day] = [];
        }
        const uniqueId = `${dest.name}-${dest.x}-${dest.y}`;
        initializedItems[dest.day].push(uniqueId);
      })

      setAddedItemsByDay(initializedItems);
    }
  },[props.destination]);

  // 플래너 리스트 활성화
  const handleStatePlanner = () => {
    setDateState(false);
    setListState(true);
  };

  // N일차를 눌렀을 때 부모 컴포넌트로 N을 전달, 본인 상태에도 저장
  const handleSelect = (data) => {
    setSelectedDay(data);
    props.DayState(data);
  };

  // typeState가 변경될 때 handleSearch 실행
  useEffect(() => {
    if (
      typeState === "식당" ||
      typeState === "숙소" ||
      typeState === "관광지"
    ) {
      handleSearch();
    }
  }, [typeState]);

  // 검색을 위한 지역명 받아오기
  const handleAreaName = (data) => {
    console.log("데타", data);
    setAreaName(data);
  };

  // 검색
  const handleSearch = () => {
    if (typeState == "관광지") {
      axios
        .post(
          "http://localhost:9000/planner/searchDestination",
          {
            type: typeState,
            word: encodeURIComponent(word.trim()),
            areaName: props.areaName,
            areaCode: props.areaCode,
            pageNo: currentPage,
          },
          { "Content-Type": "application/json" }
        )
        .then((resp) => {
          const pTotal = resp.data.data.totalCount;
          const currentPageData = resp.data.data.items.item;
          const updatedSearch = new Array(pTotal).fill(null);

          const startIndex = (currentPage - 1) * resultsPerPage;
          const endIndex = startIndex + currentPageData.length;

          currentPageData.map((el, index) => {
            const data = {
              name: el.title,
              category: "관광지",
              address: el.addr1,
              description: "",
              image: el.firstimage,
              x: el.mapx,
              y: el.mapy,
            };
            updatedSearch[startIndex + index] = data;
          });
          setSearch(updatedSearch || []);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(
          "http://localhost:9000/planner/searchDestination",
          {
            type: typeState,
            word: word,
            areaName: props.areaName,
          },
          { "Content-Type": "application/json" }
        )
        .then((resp) => {
          var searchData = resp.data.data;
          const startIndex = (currentPage - 1) * resultsPerPage;
          const currentPageData = searchData.slice(
            startIndex,
            startIndex + resultsPerPage
          );

          // 비동기 작업 처리
          Promise.all(
            currentPageData.map(async (el, index) => {
              try {
                const imageResp = await axios.post(
                  "http://localhost:9000/planner/getImages",
                  {
                    businessName: el.name,
                  }
                );
                searchData[startIndex + index].image = imageResp.data.image;
              } catch (error) {
                searchData[startIndex + index].image = null; // 실패 시 기본값
              }
            })
          ).then(() => {
            setSearch(searchData || []);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  // 검색한 장소 플래너에 추가
  const handleSearchAdd = (day, data) => {
    const uniqueId = data.uniqueId;
    // event.stopPropagation();
    props.ClickSearch(data);
    props.AddDestination({ day: selectedDay, data: data });
    setAddedItemsByDay((prev) => ({
      ...prev,
      [day]: prev[day] ? [...prev[day], uniqueId] : [uniqueId],
    }));
  };

  const handleSearchRemove = (day, data) => {
    const uniqueId = data.uniqueId; 
    props.DeleteDestination({ day, data }); // 부모 컴포넌트 업데이트
    setAddedItemsByDay((prev) => {
      const updatedDayItems = prev[day]?.filter((id) => id !== uniqueId) || [];
      console.log("Removed Items:", updatedDayItems);
      return {
        ...prev,
        [day]: updatedDayItems,
      };
    });
  };
  const handleAllDelete = () => {
    props.DeleteAllDestination();
    setAddedItemsByDay({});
  };


  // DB에 플래너 추가
  const addPlanner = async () => {
    if(!loginStatus) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다");
      navigate(`/user/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return ;
    }

    if (!listState) {
      alert("이전 단계를 완료하세요.");
      return;
    }
    
    if (props.DestinationData.length === 0) {
      alert("경로를 지정해주세요.");
      return;
    }

    const plannerDays = new Set(props.DestinationData.map((item) => item.day));
   
    for(let i=1; i <= day; i++){
      if(!plannerDays.has(i)) {
        alert(`${i}일차에 최소 한 개 이상의 여행 장소를 추가해주세요`);
        return ;
      }
    }
    if (props.plannerid) {

      await axios
        .post(
          "http://localhost:9000/planner/updatePlanner",
          {
            plannerid:props.plannerid,
            areaName: props.areaName,
            isPublic: isPublic,
            destination: props.destination,
            day: day,
            startDate: props.startDate,
            endDate: props.endDate,
            userid: props.loginData.userid,
            title: plannerTitle,
            description: plannerDescription,
          },
          { "Content-Type": "application/json" }
        )
        .then((resp) => {
          console.log(resp);
          alert("플래너를 성공적으로 수정하였습니다!");
          navigate("/planner/board");
        })
        .catch((err) => {
          console.log(err);
          alert("플래너를 수정하지 못했습니다.");
        });
    } else {
      await axios
        .post(
          "http://localhost:9000/planner/addPlanner",
          {
            areaName: props.areaName,
            areaCode : props.areaCode,
            isPublic: isPublic,
            destination: props.DestinationData,
            day: day,
            startDate: props.startDate,
            endDate: props.endDate,
            userid: props.loginData.userid,
            title: plannerTitle,
            description: plannerDescription,
          },
          { "Content-Type": "application/json" }
        )
        .then((resp) => {
          console.log(resp);
          alert("플래너를 성공적으로 작성하였습니다!");
          closeModal(); //모달 닫기
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          alert("플래너를 작성하지 못했습니다.");
        });
    }
  };

  // 몇박인지 결정되면 리스트로 넘어가게끔 설정
  useEffect(() => {
    if (isMounted.current) {
      handleStatePlanner();
    } else {
      isMounted.current = true;
    }
  }, [day]);

  useEffect(() => {
    if (isMountedSearch.current) {
      handleSearch();
    } else {
      isMountedSearch.current = true;
    }
  }, [areaCode]);

  useEffect(() => {
    if (isMountedSearch.current) {
      handleSearch();
    } else {
      isMountedSearch.current = true;
    }
  }, [currentPage]);

  // 페이징 로직 ---------------------------------------------------------------------------------------
  // 검색 결과를 현재 페이지에 맞게 잘라서 표시
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = search.slice(indexOfFirstResult, indexOfLastResult);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(search.length / resultsPerPage);

  // 보여줄 페이지 범위 계산
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const startPage =
    Math.floor((currentPage - 1) / pagesToShow) * pagesToShow + 1;
  const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // "Previous" 버튼 클릭
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - pagesToShow);
    }
  };

  // "Next" 버튼 클릭
  const handleNext = () => {
    if (currentPage + pagesToShow <= totalPages) {
      setCurrentPage(currentPage + pagesToShow);
    }
  };

  useEffect(() => {
    if (
      Object.keys(updateData).length > 0 &&
      Object.keys(updateData)[0] == "updateData"
    ) {
      setIsPublic(updateData.updateData.isPublic);
      setDay(updateData.updateData.day);
      setAreaName(updateData.updateData.areaName);
      setPlannerID(updateData.updateData.plannerid);

      const transformData = (data) => {
        return data.map((item) => ({
          day: item.day,
          data: {
            name: item.name,
            x: item.x,
            y: item.y,
            locationFullAddress: item.address,
            address: item.address,
            category: item.category,
            image: item.image,
          },
          image: item.image,
        }));
      };
      props.UpdatePlanner(transformData(updateData.updateData.destinations));
    }
    if (
      Object.keys(bringData).length > 0 &&
      Object.keys(bringData)[0] == "bringData"
    ) {
      setIsPublic(bringData.bringData.isPublic);
      setDay(bringData.bringData.day);
      setAreaName(bringData.bringData.areaName);
      setPlannerID(0);

      const transformData = (data) => {
        return data.map((item) => ({
          day: item.day,
          data: {
            name: item.name,
            x: item.x,
            y: item.y,
            locationFullAddress: item.address,
            address: item.address,
            category: item.category,
            image: item.image,
          },
          image: item.image,
        }));
      };
      props.UpdatePlanner(transformData(bringData.bringData.destinations));
    }
  }, []);

  return (
    <>
      <div className="sidebar">
        <div className="option">
          <div
            className="optionButton"
            onClick={() => {
              const confirmNavigation = window.confirm(
                "변경사항이 저장되지 않았습니다. 이동하시겠습니까?"
              );
              if (confirmNavigation) {
                navigate("/");
              }
            }}
          >
            {/* <img className="sidebar-logo" src={Logo} alt="" /> */}
            <h2 className="sidebar-logo">WanderLog</h2>
          </div>
          <div
            className={`optionButton ${typeState === "식당" ? "active" : ""}`}
            onClick={() => {
              setTypeState("식당");
              // handleSearch();
            }}
          >
            <span>식당 선택</span>
          </div>

          <div
            className={`optionButton ${typeState === "숙소" ? "active" : ""}`}
            onClick={() => {
              setTypeState("숙소");
              // handleSearch();
            }}
          >
            <span>숙소 선택</span>
          </div>

          <div
            className={`optionButton ${typeState === "관광지" ? "active" : ""}`}
            onClick={() => {
              setTypeState("관광지");
              // handleSearch();
            }}
          >
            <span>관광지 선택</span>
          </div>

          <div
            className={`optionButton planCommit ${
              typeState === "관광지" ? "highlight" : ""
            }`}
            onClick={() => {
              openModal();
            }}
          >
            <span>저장</span>
          </div>
        </div>

        {/* 맨 마지막에 생성되는 일정생성 모달창 */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          plannerTitle={plannerTitle}
          setPlannerTitle={setPlannerTitle}
          plannerDescription={plannerDescription}
          setPlannerDescription={setPlannerDescription}
          isPublic={isPublic}
          setIsPublic={setIsPublic}
          onSave={addPlanner}
        ></Modal>

        {
          <div className="question">
            {/* <p>SEARCH</p> */}
            <h2 className="question-h2">{props.areaName}</h2>
            <div className="question-date">
              {new Date(props.startDate).toLocaleDateString()} -{" "}
              {new Date(props.endDate).toLocaleDateString()}
            </div>
            <div className="question-search">
              <input
                type="text"
                value={word}
                placeholder="검색어를 입력해주세요"
                onChange={(e) => {
                  setWord(e.target.value);
                }}
              />
              <span className="question-search-button" onClick={handleSearch}>
                <img src={Search} alt="" />
              </span>
            </div>
            {/* {totalPages > 0 && (  //페이지 총 개수 나옴
              <span className="total-page">
                {currentPage}/{totalPages}
              </span>
            )} */}
            <div className="search-btns">
              <button
                className={`search-btn ${typeState === "식당" ? "active" : ""}`}
                onClick={(e) => {
                  setTypeState(e.target.innerText);
                  console.log(e.target.innerText);
                }}
              >
                식당
              </button>
              <button
                className={`search-btn ${typeState === "숙소" ? "active" : ""}`}
                onClick={(e) => {
                  setTypeState(e.target.innerText);
                }}
              >
                숙소
              </button>
              <button
                className={`search-btn ${
                  typeState === "관광지" ? "active" : ""
                }`}
                onClick={(e) => {
                  setTypeState(e.target.innerText);
                }}
              >
                관광지
              </button>
            </div>
            <div className="search-body">
              <ul>
                {search && //타입이 관광지인 경우
                  search.length > 0 &&
                  typeState == "관광지" &&
                  currentResults &&
                  currentResults.length > 0 &&
                  currentResults.map((el, index) => {
                    if (!el) return null; //el 이 null 또는 undefined 인 경우 무시
                    const uniqueId = `${el.name}-${el.x}-${el.y}`;
                    el.uniqueId = uniqueId;

                    const isAdded = addedItemsByDay[selectedDay]?.includes(
                      el.uniqueId
                    );
                    return (
                      <li
                        key={index}
                        className="search-card"
                        onClick={() => {
                          props.ClickSearch(el);
                          console.log(el.image, el);
                        }}
                      >
                        <div className="card-image">
                          <img
                            src={el && el.image !== "" ? el.image : NoImage}
                            alt=""
                          />
                        </div>

                        <div className="card-body">
                          <div className="card-name">{el && el.name}</div>
                          <div className="card-category">
                            {el && el.category}
                          </div>
                          <div className="card-addr">{el && el.address}</div>
                          {/* <div className="card-desc">
                            {el && el.description}
                          </div> */}
                        </div>
                        <div className="card-add">
                          <button
                            className={isAdded ? "cardAdded" : ""}
                            onClick={(event) => {
                              event.stopPropagation();
                              if (isAdded) {
                                handleSearchRemove(selectedDay, el);
                              } else {
                                handleSearchAdd(selectedDay, el);
                              }
                            }}
                          >
                            {isAdded ? "-" : "+"}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                {search && //타입이 관광지인 경우
                  search.length > 0 &&
                  typeState != "관광지" &&
                  currentResults &&
                  currentResults.length > 0 &&
                  currentResults.map((el, index) => {
                    if (!el) return null; //el 이 null 또는 undefined 인 경우 무시
                    const uniqueId = `${el.name}-${el.x}-${el.y}`;
                    el.uniqueId = uniqueId;

                    const isAdded = addedItemsByDay[selectedDay]?.includes(
                      el.uniqueId
                    );
                    return (
                      <li
                        key={index}
                        className="search-card"
                        onClick={() => {
                          props.ClickSearch(el);
                          console.log(el);
                        }}
                      >
                        <div className="card-image">
                          <img
                            src={
                              el && el.image !== "No image found"
                                ? el.image
                                : NoImage
                            }
                            alt=""
                          />
                        </div>
                        <div className="card-body">
                          <div className="card-name">{el && el.name}</div>
                          <div className="card-category">
                            {el && el.category}
                          </div>
                          <div className="card-addr">{el && el.address}</div>
                          {/* <div className="card-desc">
                            {el && el.description}
                          </div> */}
                        </div>
                        <div className="card-add">
                          <button
                            className={isAdded ? "cardAdded" : ""}
                            onClick={(event) => {
                              event.stopPropagation();
                              if (isAdded) {
                                handleSearchRemove(selectedDay, el);
                              } else {
                                handleSearchAdd(selectedDay, el);
                              }
                            }}
                          >
                            {isAdded ? "-" : "+"}
                          </button>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
            {search.length != 0 && (
              <div className="pagination">
                <button
                  onClick={() => {
                    handlePrevious();
                  }}
                  disabled={currentPage === 1}
                >
                  이전
                </button>
                <span>
                  {pageNumbers
                    .slice(startPage - 1, endPage)
                    .map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => {
                          paginate(pageNumber);
                        }}
                        className={pageNumber === currentPage ? "active" : ""}
                      >
                        {pageNumber}
                      </button>
                    ))}
                </span>
                <button
                  onClick={() => {
                    handleNext();
                  }}
                  disabled={currentPage + pagesToShow > totalPages}
                >
                  다음
                </button>
              </div>
            )}
          </div>
        }
        <div className="content">
          {listState && (
            <>
              <div className="content-planner">
                <h2>{loginStatus ? (props.loginData.username) : ("Guest")} 님의 여행계획</h2>
                <div className="plannerMenu">
                  <p>{`${selectedDay} 일차 계획`}</p>
                  <button
                    onClick={() => {
                      handleAllDelete();
                    }}
                    className="delete-destination-btn"
                  >
                    비우기
                  </button>
                </div>
                <div className="plannerList">
                  <div className="content-side">
                    {(() => {
                      const nthDay = [];
                      for (let i = 1; i <= day; i++) {
                        nthDay.push(
                          <div
                            key={i}
                            className={`optionButton ${
                              selectedDay === i ? "selectedDay" : ""
                            }`}
                            onClick={() => {
                              handleSelect(i);
                            }}
                          >
                            <span>{`${i}일차`}</span>
                          </div>
                        );
                      }
                      return nthDay;
                    })()}
                  </div>
                  <div className="content-body">
                    {selectedDay && (
                      <ul>
                        {props.DestinationData.length > 0 &&
                          props.DestinationData.filter(
                            (el) => el.day === selectedDay
                          ).map((destination, index) => {
                            return (
                              <li
                                key={index}
                                className="content-card"
                                onClick={() => {
                                  props.ClickPlanner(destination);
                                  console.log(destination.data);
                                }}
                              >
                                <div className="card-image">
                                  {(destination &&
                                    destination.data.image == null) ||
                                    (destination.data.image == "" && (
                                      <img src={NoImage} alt="없음" />
                                    ))}
                                  {destination &&
                                    destination.data.image != null &&
                                    destination.data.image != "" && (
                                      <img
                                        src={destination.data.image}
                                        alt=""
                                      />
                                    )}
                                </div>
                                <div className="card-content">
                                  <div className="card-header">
                                    <div className="card-name">
                                      {destination && destination.data.name}
                                    </div>
                                    <div className="card-category">
                                      {destination && destination.data.category}
                                    </div>
                                    <div className="card-addr">
                                      {destination && destination.data.address}
                                    </div>
                                    <div className="card-button">
                                      <button
                                        className="card-deleteBtn"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleSearchRemove(
                                            selectedDay,
                                            destination.data
                                          );
                                        }}
                                      >
                                        <img src={Delete} alt="삭제" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SideBar;
