import React, { useEffect, useState } from "react";
import { StatusBox, Table } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import styles from "./HomePage.module.css";

function HomePage() {
  const [appt, setAppt] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sort, setSort] = useState("");
  var [passed, setPassed] = useState(0)
  var [pending, setPending] = useState(0)
  var [rescheduled, setRescheduled] = useState(0)
  var [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    GetAppointments();
  }, [sort, searchQuery]);

  function sortArrayByName(arr) {
    arr.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
    return arr;
  }

  function codeInOrder(arr) {
    arr.sort((a, b) => {
      if (a.uniqueCode < b.uniqueCode) {
        return -1;
      } else if (a.uniqueCode > b.uniqueCode) {
        return 1;
      } else {
        return 0;
      }
    });
    return arr;
  }

  function sortArrayByAge(arr) {
    arr.sort((a, b) => {
      return a.age - b.age;
    });
    return arr;
  }

  function sortArrayByAddress(arr) {
    arr.sort((a, b) => {
      if (a.address < b.address) {
        return -1;
      } else if (a.address > b.address) {
        return 1;
      } else {
        return 0;
      }
    });
    return arr;
  }

  const GetAppointments = () => {
    fetch("https://dr-ngwashi.onrender.com/")
      .then((res) => res.json())
      .then((data) => {
        let tempArr = data;
        if (searchQuery) {
          tempArr = tempArr.filter((appt) =>
            appt.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (sort === "nameInAlph") {
          tempArr = sortArrayByName(tempArr);
        } else if (sort === "codeInOrder") {
          tempArr = codeInOrder(tempArr);
        } else if (sort === "ageInOrder") {
          tempArr = sortArrayByAge(tempArr);
        } else if (sort === "addrInAlph") {
          tempArr = sortArrayByAddress(tempArr);
        }
        setAppt(tempArr);

        let passedCount = 0;
        let pendingCount = 0;
        let rescheduledCount = 0;

        data.forEach((appt) => {
          if (appt.apptStatus === "Passed") {
            passedCount++;
          } else if (appt.apptStatus === "Pending") {
            pendingCount++;
          } else if (appt.apptStatus === "Rescheduled") {
            rescheduledCount++;
          }
        });
        setPassed(passedCount);
        setPending(pendingCount);
        setRescheduled(rescheduledCount);
      })
      .catch((e) => console.error("Error", e));
  };

  if (sort === "nameInAlph") {
    sortArrayByName(appt);
  }
  console.log(
    `missed ${pending} rescheduled ${rescheduled} passed: ${passed} `
  );

  // const statusCount = (arr) => {
  //   for (var i = 0; i < arr.length; i++){
  //     if (arr[i].apptStatus == 'Rescheduled') setRescheduled(rescheduled + 1)
  //     else if (arr[i].apptStatus == "Pending") setPending(pending + 1);
  //     else if (arr[i].apptStatus == "Passed") setPassed(passed + 1);
  //   }
  // }

  // statusCount(appt)
  // // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appt.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.homePage}>
      <div className={styles.container1}>
        <div>
          <p className={styles.appointment}>
            Ap<span className={styles.underline}>pointme</span>nts
          </p>
        </div>
        <div className={styles.inputWrapper}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search a name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />{" "}
          <FontAwesomeIcon
            className={styles.searchIcon}
            icon={faMagnifyingGlass}
          />
        </div>
      </div>
      <div className={styles.status}>
        <StatusBox
          textColor={"#D92B2E"}
          title="Missed"
          bgcolor={"#EECECF"}
          amount={passed}
        />
        <StatusBox
          title="Rescheduled"
          textColor={"#E28F1E"}
          bgcolor={"#EEDAC1"}
          amount={rescheduled}
        />
        <StatusBox
          title="Passed"
          bgcolor={"#CFD6CF"}
          textColor={"#4E7A66"}
          amount={pending}
        />
      </div>
      <Table tableData={currentItems} getSortCriteria={setSort} />
      <div className={styles.pagination}>
        {appt.length > itemsPerPage ? (
          <ul className={styles.paginationList}>
            <li className="previous">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                {"<"}
              </button>
            </li>
            {new Array(Math.ceil(appt.length / itemsPerPage))
              .fill("")
              .map((_, index) => {
                let page;

                if (
                  index === 0 ||
                  index === Math.ceil(appt.length / itemsPerPage) - 1 ||
                  (index > currentPage - 3 && index < currentPage + 1)
                ) {
                  page = (
                    <li
                      key={index}
                      className={currentPage === index + 1 ? styles.active : ""}
                    >
                      <button onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  );
                } else if (
                  (index === 1 && currentPage > 4) ||
                  (index === Math.ceil(appt.length / itemsPerPage) - 2 &&
                    currentPage < Math.ceil(appt.length / itemsPerPage) - 3) ||
                  index === currentPage - 3 ||
                  index === currentPage + 1
                ) {
                  page = (
                    <li key={index} className={styles.disabled}>
                      <span>{"..."}</span>
                    </li>
                  );
                } else {
                  return null;
                }

                return page;
              })}
            <li className="next">
              <button
                disabled={currentPage === Math.ceil(appt.length / itemsPerPage)}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                {">"}
              </button>
            </li>
          </ul>
        ) : null}
      </div>
      <div className={styles.bottomContainer}>
        <div></div>
        <div className={styles.plus}>
          <Link className={styles.plus} to="/records">
            +
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
