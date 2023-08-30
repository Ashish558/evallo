<div className="lg:grid hidden px-2 mt-[300px] relative grid-cols-12 grid-ros-6 lg:mt-10 gap-5 lg:pl-3 ">
<ProfileCard
  className="col-span-3 py-6 px-4 mt-3  lg:mt-0"
  body={
    <div className="flex justify-center flex-col">
      <div className="flex flex-1 flex-col mr-8">
        {/* <p className='text-primary text-center font-bold flex lg:text-lg whitespace-nowrap mb-1.5'>
                    Birth year
                 </p> */}
        <EditableText
          editable={editable}
          onClick={() =>
            setToEdit({
              ...toEdit,
              birthYear: { ...toEdit.birthYear, active: true },
            })
          }
          text="Birth year"
          className="text-lg mb-2"
          textClassName="text-[21px]"
        />
        <p className=" font-medium text-[16px] lg:opacity-60 mb-5">
          {userDetail.birthyear ? userDetail.birthyear : "-"}
        </p>
      </div>
      <div className="flex flex-1 flex-col">
        <EditableText
          editable={editable}
          onClick={() =>
            setToEdit({
              ...toEdit,
              subjects: { ...toEdit.subjects, active: true },
            })
          }
          text="Subjects"
          className="text-lg mb-2"
          textClassName="text-[21px]"
        />
        <div className="grid grid-cols-2">
          {userDetail.subjects
            ? userDetail.subjects.map((sub, idx) => {
                return (
                  <p
                    key={idx}
                    className="mt-1 gap-1 font-medium text-[16px] lg:mt-2 lg:opacity-60"
                  >
                    {sub}{" "}
                  </p>
                );
              })
            : "-"}
        </div>
      </div>
    </div>
  }
/>

<div className="col-span-2 flex  justify-center items-center  scrollbar-content overflow-x-auto lg:py-5 bg-primary-light px-4 py-5 rounded-15"></div>

<div className="col-span-4 flex flex-col justify-between">
  <ProfileCard
    className="mt-5 mt-auto flex-1"
    title={
      <EditableText
        editable={editable}
        onClick={() =>
          setToEdit({
            ...toEdit,
            aboutScore: { ...toEdit.aboutScore, active: true },
          })
        }
        text="PSAT / P-ACT Scores"
        className="text-[21px] mb-2 flex justify-start"
      />
    }
    titleClassName="text-left"
    body={
      <div className="flex mt-5 lg:mt-5">
        <p className=" font-semibold text-[18px]">
          {userDetail.aboutScore ? userDetail.aboutScore : "-"}
        </p>
      </div>
    }
  />
</div>

<ProfileCard
  className="col-span-3 mt-6 lg:mt-0"
  body={
    <div className="overflow-x-auto scrollbar-content">
      <div className="mb-6">
        <EditableText
          editable={editable}
          onClick={() =>
            setToEdit({
              ...toEdit,
              timeZone: { ...toEdit.timeZone, active: true },
            })
          }
          text="Time Zone"
          textClassName="text-[21px]"
          className="text-lg mb-2"
        />
        <p className="mt-1.5 font-medium text-[18px] text-[#00000099] whitespace-nowrap">
          {userDetail.timeZone ? userDetail.timeZone : "-"}
        </p>
      </div>
      <div className="mb-6">
        <EditableText
          editable={editable}
          onClick={() =>
            setToEdit({
              ...toEdit,
              subscriptionCode: {
                ...toEdit.subscriptionCode,
                active: true,
              },
            })
          }
          text="Subscription"
          textClassName="text-[21px]"
          className="text-lg mb-2"
        />
        <p className="mt-1.5 font-medium text-[18px] text-[#00000099] whitespace-nowrap">
          {userDetail.subscriptionCode
            ? userDetail.subscriptionCode
            : "-"}
        </p>
      </div>
      <div>
        <p className="text-primary font-bold text-lg">
          <EditableText
            editable={editable}
            onClick={() =>
              setToEdit({
                ...toEdit,
                accomodations: {
                  ...toEdit.accomodations,
                  active: true,
                },
              })
            }
            text="Accomodations"
            textClassName="text-[21px]"
            className="text-lg mb-2"
          />
        </p>
        <p className="mt-1.5 font-medium text-[18px] text-[#00000099] whitespace-nowrap">
          {userDetail.accomodations ? userDetail.accomodations : "-"}
        </p>
      </div>
    </div>
  }
/>
-
<ProfileCard
  className="mt-53 col-span-3 lg:mt-0"
  body={
    <>
      <EditableText
        editable={editable}
        onClick={() =>
          setToEdit({
            ...toEdit,
            personality: { ...toEdit.personality, active: true },
          })
        }
        text="Personality"
        className="text-lg mb-2"
        textClassName="flex-1 text-center text-[21px]"
      />
      <div className="flex scrollbar-content max-h-[500px]  scrollbar-vertical flex-col row-span-2 overflow-x-auto scrollbar-content h-[450px]">
        {settings &&
          settings.personality &&
          settings.personality.length > 0 &&
          userDetail.personality &&
          userDetail.personality.map((id, idx) => {
            return settings.personality.find(
              (item) => item._id === id
            ) ? (
              <div
                key={idx}
                className="flex flex-col items-center mb-10"
              >
                <div className="flex h-90 w-90 rounded-full  items-center justify-center mb-3">
                  <img
                    className="max-w-[90px] max-h-[90px]"
                    src={
                      settings.personality.find(
                        (item) => item._id === id
                      )
                        ? `${awsLink}${
                            settings.personality.find(
                              (item) => item._id === id
                            )?.image
                          }`
                        : ""
                    }
                  />
                </div>
                <p className="opacity-70 font-semibold text-lg">
                  {settings.personality.find(
                    (item) => item._id === id
                  ) ? (
                    settings.personality.find(
                      (item) => item._id === id
                    ).text
                  ) : (
                    <></>
                  )}
                </p>
              </div>
            ) : (
              <></>
            );
          })}
      </div>
    </>
  }
/>

<div className="col-span-6">
  <ProfileCard
    titleClassName="text-left text-[21px]"
    className="mt-53 lg:mt-0"
    body={
      <>
        <OwlCarousel
          className={`owl-carousel owl-theme ${styles.scoreCarousel}`}
          margin={30}
          items={1}
        >
          <SubjectSlider
            score={
              userDetail.satScores
                ? {
                    verbal: userDetail.satScores[0]?.verbal,
                    maths: userDetail.satScores[0]?.maths,
                  }
                : {}
            }
            totalMarks={userDetail.satScores ? getSatMarks(0) : "-"}
            outOf={"1600"}
            isSat={true}
            header={
              <EditableText
                editable={editable}
                onClick={() => {
                  setSelectedScoreIndex(0);
                  setToEdit({
                    ...toEdit,
                    satScores: {
                      ...toEdit.satScores,
                      active: true,
                    },
                  });
                }}
                text="Official SAT Scores"
                className="text-lg mb-2"
                imgClass={styles.editIcon}
                textClassName="flex-1 text-center text-[21px]"
              />
            }
            subjects={subjects1}
            title="Composite Score"
          />
          <SubjectSlider
            score={
              userDetail.satScores
                ? {
                    verbal: userDetail.satScores[1]?.verbal,
                    maths: userDetail.satScores[1]?.maths,
                  }
                : {}
            }
            totalMarks={userDetail.satScores ? getSatMarks(1) : "-"}
            outOf={"1600"}
            isSat={true}
            header={
              <EditableText
                editable={editable}
                onClick={() => {
                  setSelectedScoreIndex(1);
                  setToEdit({
                    ...toEdit,
                    satScores: {
                      ...toEdit.satScores,
                      active: true,
                    },
                  });
                }}
                text="Official SAT Scores"
                className="text-lg mb-2"
                imgClass={styles.editIcon}
                textClassName="flex-1 text-center text-[21px]"
              />
            }
            subjects={subjects1}
            title="Composite Score"
          />
          {userDetail.satScores?.length >= 2 && (
            <SubjectSlider
              score={
                userDetail.satScores
                  ? {
                      verbal: userDetail.satScores[2]?.verbal,
                      maths: userDetail.satScores[2]?.maths,
                    }
                  : {}
              }
              totalMarks={userDetail.satScores ? getSatMarks(2) : "-"}
              outOf={"1600"}
              isSat={true}
              header={
                <EditableText
                  editable={editable}
                  onClick={() => {
                    setSelectedScoreIndex(2);
                    setToEdit({
                      ...toEdit,
                      satScores: {
                        ...toEdit.satScores,
                        active: true,
                      },
                    });
                  }}
                  text="Official SAT Scores"
                  className="text-lg mb-2"
                  imgClass={styles.editIcon}
                  textClassName="flex-1 text-center text-[21px]"
                />
              }
              subjects={subjects1}
              title="Composite Score"
            />
          )}
        </OwlCarousel>
      </>
    }
  />
  <ProfileCard
    titleClassName="text-left"
    className="mt-8"
    body={
      <>
        <OwlCarousel
          className={`owl-carousel owl-theme ${styles.scoreCarousel}`}
          margin={30}
          items={1}
        >
          <SubjectSlider
            totalMarks={userDetail.actScores ? getActMarks(0) : "-"}
            outOf={"36"}
            isAct={true}
            score={
              userDetail.actScores
                ? {
                    reading: userDetail.actScores[0]?.reading,
                    maths: userDetail.actScores[0]?.maths,
                    science: userDetail.actScores[0]?.science,
                    english: userDetail.actScores[0]?.english,
                  }
                : {}
            }
            header={
              <EditableText
                editable={editable}
                onClick={() => {
                  setSelectedScoreIndex(0);
                  setToEdit({
                    ...toEdit,
                    actScores: {
                      ...toEdit.actScores,
                      active: true,
                    },
                  });
                }}
                text="Official ACT Scores"
                imgClass={styles.editIcon}
                className="text-lg mb-2"
                textClassName="flex-1 text-center text-[21px]"
              />
            }
            subjects={subjects2}
            title="Composite Score"
          />

          <SubjectSlider
            totalMarks={userDetail.actScores ? getActMarks(1) : "-"}
            outOf={"36"}
            isAct={true}
            score={
              userDetail.actScores
                ? {
                    reading: userDetail.actScores[1]?.reading,
                    maths: userDetail.actScores[1]?.maths,
                    science: userDetail.actScores[1]?.science,
                    english: userDetail.actScores[1]?.english,
                  }
                : {}
            }
            header={
              <EditableText
                editable={editable}
                onClick={() => {
                  setSelectedScoreIndex(1);
                  setToEdit({
                    ...toEdit,
                    actScores: {
                      ...toEdit.actScores,
                      active: true,
                    },
                  });
                }}
                text="Official ACT Scores"
                imgClass={styles.editIcon}
                className="text-lg mb-2"
                textClassName="flex-1 text-center text-[21px]"
              />
            }
            subjects={subjects2}
            title="Composite Score"
          />
          {userDetail.actScores?.length >= 2 && (
            <SubjectSlider
              totalMarks={userDetail.actScores ? getActMarks(2) : "-"}
              outOf={"36"}
              isAct={true}
              score={
                userDetail.actScores
                  ? {
                      reading: userDetail.actScores[2]?.reading,
                      maths: userDetail.actScores[2]?.maths,
                      science: userDetail.actScores[2]?.science,
                      english: userDetail.actScores[2]?.english,
                    }
                  : {}
              }
              header={
                <EditableText
                  editable={editable}
                  onClick={() => {
                    setSelectedScoreIndex(2);
                    setToEdit({
                      ...toEdit,
                      actScores: {
                        ...toEdit.actScores,
                        active: true,
                      },
                    });
                  }}
                  text="Official ACT Scores"
                  imgClass={styles.editIcon}
                  className="text-lg mb-2"
                  textClassName="flex-1 text-center text-[21px]"
                />
              }
              subjects={subjects2}
              title="Composite Score"
            />
          )}
        </OwlCarousel>
      </>
    }
  />
</div>
<ProfileCard
  className="mt-53 pb-0 col-span-3 lg:mt-0 overflow-auto "
  body={
    <>
      <EditableText
        editable={editable}
        onClick={() =>
          setToEdit({
            ...toEdit,
            interest: { ...toEdit.interest, active: true },
          })
        }
        text="Interests"
        className="text-lg mb-2"
        textClassName="flex-1 text-center text-[21px]"
      />
      <div className="flex scrollbar-content max-h-[500px]  scrollbar-vertical flex-col overflow-x-auto">
        {settings &&
          settings.interest.length > 0 &&
          userDetail.interest.map((id, idx) => {
            return settings.interest.find(
              (item) => item._id === id
            ) ? (
              <div
                key={idx}
                className="flex flex-col items-center mb-10"
              >
                <div className="flex h-90 w-90 rounded-full  items-center justify-center mb-3">
                  <img
                    className="max-w-[90px] max-h-[90px]"
                    src={
                      settings.interest.find(
                        (item) => item._id === id
                      )
                        ? `${awsLink}${
                            settings.interest.find(
                              (item) => item._id === id
                            ).image
                          }`
                        : ""
                    }
                  />
                </div>
                <p className="opacity-70 font-semibold text-lg">
                  {settings.interest.find(
                    (item) => item._id === id
                  ) ? (
                    settings.interest.find((item) => item._id === id)
                      .text
                  ) : (
                    <></>
                  )}
                </p>
              </div>
            ) : (
              <></>
            );
          })}
      </div>
    </>
  }
/>

{persona === "admin" || editableByTutor ? (
  <>
    <ProfileCard
      className="mt-4 lg:order-6 lg:mt-0 lg:col-span-3"
      body={
        <div className="flex">
          <div className="flex-1 lg:mr-12">
            <EditableText
              editable={editable}
              onClick={() =>
                setToEdit({
                  ...toEdit,
                  service: { ...toEdit.service, active: true },
                })
              }
              text="Service and Specialization"
              className="lg:text-21 text-left"
            />
            <div className="font-medium text-sm mt-2 lg:mt-6 flex flex-wrap lg:opacity-60">
              {/* {userDetail.subscribeType ? userDetail.subscribeType : '-'} */}
              {userDetail.service
                ? userDetail.service.map((service, idx) => {
                    return (
                      <p key={idx} className="opacity-80 mb-1 mr-1">
                        {service}
                        {idx < userDetail.service.length - 1
                          ? ","
                          : ""}
                      </p>
                    );
                  })
                : "-"}
            </div>
          </div>
        </div>
      }
    />
    <ProfileCard
      className="mt-4 lg:order-7 lg:mt-0 lg:col-span-9"
      body={
        <div className="flex">
          <div className="flex-1 lg:mr-12">
            <EditableText
              editable={editable}
              onClick={() =>
                setToEdit({
                  ...toEdit,
                  notes: { ...toEdit.notes, active: true },
                })
              }
              text="Additional Note"
              className="lg:text-21 whitespace-nowrap"
            />
            <p className="font-medium text-sm mt-2 lg:mt-6 lg:opacity-60">
              {userDetail.notes ? userDetail.notes : "-"}
            </p>
          </div>
        </div>
      }
    />
  </>
) : (
  ""
)}
{persona === "admin" && (
  <>
    <ProfileCard
      className="mt-4 lg:order-8 lg:mt-5 lg:col-span-3"
      body={
        <div className="flex">
          <div className="flex-1 lg:mr-12">
            <EditableText
              editable={editable}
              onClick={() =>
                setToEdit({
                  ...toEdit,
                  leadStatus: {
                    ...toEdit.leadStatus,
                    active: true,
                  },
                })
              }
              text="Lead Status"
              className="lg:text-21 whitespace-nowrap"
            />
            <p className="font-medium text-sm mt-2 lg:mt-6 lg:opacity-60">
              {userDetail.leadStatus ? userDetail.leadStatus : "-"}
            </p>
          </div>
        </div>
      }
    />
    <ProfileCard
      className="mt-4 lg:order-9 lg:mt-5 lg:col-span-9"
      body={
        <div className="flex">
          <div className="flex-1 lg:mr-12">
            <EditableText
              editable={false}
              onClick={() =>
                setToEdit({
                  ...toEdit,
                  timeZone: { ...toEdit.timeZone, active: true },
                })
              }
              text="Sign Up Form Details"
              className="lg:text-21 whitespace-nowrap"
            />
            <div className="grid grid-cols-2 py-4 pt-5">
              <div className="mb-7">
                <p className="font-semibold mb-2">First Name</p>
                <p className="opacity-80"> {user.firstName} </p>
              </div>
              <div className="mb-7">
                <p className="font-semibold mb-2">Last Name</p>
                <p className="opacity-80"> {user.lastName} </p>
              </div>
              <div className="mb-7">
                <p className="font-semibold mb-2">
                  Are you a parent or student?
                </p>
                <p className="opacity-80"> Student </p>
              </div>
              <div className="mb-7">
                <p className="font-semibold mb-2">Phone Number</p>
                <p className="opacity-80">
                  {" "}
                  {user.phone ? user.phone : "-"}{" "}
                </p>
              </div>
              <div className="mb-7 col-span-2">
                <p className="font-semibold mb-2">
                  What service are you seeking?
                </p>
                <div>
                  {userDetail.serviceSeeking.map((service, idx) => {
                    return (
                      <p
                        key={idx}
                        className="opacity-80 inline-block mr-1"
                      >
                        {service}
                        {idx < userDetail.serviceSeeking.length - 1
                          ? ","
                          : ""}{" "}
                      </p>
                    );
                  })}
                </div>
              </div>

              <div className="mb-7">
                <p className="font-semibold mb-2">
                  Parent First Name
                </p>
                <p className="opacity-80"> {userDetail.FirstName} </p>
              </div>
              <div className="mb-7">
                <p className="font-semibold mb-2">
                  Parent Last Name{" "}
                </p>
                <p className="opacity-80"> {userDetail.LastName} </p>
              </div>
              <div className="mb-7">
                <p className="font-semibold mb-2">Parent Email</p>
                <p className="opacity-80"> {userDetail.Email} </p>
              </div>
              <div className="mb-7">
                <p className="font-semibold mb-2">Parent Phone </p>
                <p className="opacity-80"> {userDetail.Phone} </p>
              </div>
              <div className="mb-7">
                <p className="font-semibold mb-2">School Name</p>
                <p className="opacity-80">
                  {" "}
                  {userDetail.schoolName}{" "}
                </p>
              </div>
              <div className="mb-7">
                <p className="font-semibold mb-2"> Grade</p>
                <p className="opacity-80">{userDetail.grade} </p>
              </div>

              <div className="mb-7 col-span-2">
                <p className="font-semibold mb-2">
                  Do you have any PSAT / P-ACT scores to share? How
                  are your student's grades in school?
                </p>
                <p className="opacity-80"> - </p>
              </div>
              <div className="mb-7 col-span-2">
                <p className="font-semibold mb-2">
                  {" "}
                  Is your child taking any AP courses in school?
                  Please select all that apply.
                </p>
                <div>
                  {userDetail.apCourses.map((service, idx) => {
                    return (
                      <p
                        key={idx}
                        className="opacity-80 inline-block mr-1"
                      >
                        {service}
                        {idx < userDetail.apCourses.length - 1
                          ? ","
                          : ""}{" "}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="mb-7 col-span-2">
                <p className="font-semibold mb-2">
                  Select if any of these apply to you{" "}
                </p>
                <div>
                  {" "}
                  {userDetail.motive.map((service, idx) => {
                    return (
                      <p key={idx} className="opacity-80 mb-1">
                        {service}
                        {idx < userDetail.motive.length - 1
                          ? ","
                          : ""}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="mb-7 col-span-2">
                <p className="font-semibold mb-2">
                  Please enter the subscription code required to
                  access Seven Square Learning and starting prep.{" "}
                </p>
                <p className="opacity-80">
                  {" "}
                  {userDetail.subscriptionCode}{" "}
                </p>
              </div>
              <div className="mb-7 col-span-2">
                <p className="font-semibold mb-2">
                  How did you hear about us?{" "}
                </p>
                <div>
                  {" "}
                  {userDetail.hearAboutUs.map((service, idx) => {
                    return (
                      <p
                        key={idx}
                        className="opacity-80 inline-block mr-1"
                      >
                        {service}
                        {idx < userDetail.hearAboutUs.length - 1
                          ? ","
                          : ""}{" "}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  </>
)}
</div>