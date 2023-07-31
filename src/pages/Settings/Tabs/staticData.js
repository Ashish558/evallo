export const studentServedData = [
  {
    text: "Early Childhood Education",
    checked: false,
  },
  {
    text: "Elementary / Primary School",
    checked: false,
  },
  {
    text: "Classroom",
    checked: false,
  },
  {
    text: "Middle School",
    checked: false,
  },
  {
    text: "Secondary /High School",
    checked: false,
  },
  {
    text: "Under Graduate Students",
    checked: false,
  },
  {
    text: "Graduate Student",
    checked: false,
  },
  {
    text: "Ph.D.  Students",
    checked: false,
  },
];

export const instructionFormat = [
  {
    text: "Online",
    checked: false,
  },
  {
    text: "In-Person",
    checked: false,
  },
  {
    text: "Classroom",
    checked: false,
  },
  {
    text: "1-on-1",
    checked: false,
  },
];

export const companyType = [
  "Sole proprietorship",
  "Partnership",
  " Limited liability company (LLC)",
  " C Corporation",
  "S Corporation",
  "B Corporation",
  " Close corporation",
  " Nonprofit corporation",
  "Cooperative",
  "Private Limited Company",
  "Public",
];

export const permissionsStaticData = [
  {
    name: "Let Tutors delete a test after assigning it?",
    permissionActionName: "tutDelTest",
    values: [true, false],
    choosedValue: false,
    _id: "64b6d068a74d84f6f1c8691a",
  },
  {
    name: "Allow Tutors to view Parent & Student contact details?",
    permissionActionName: "tutViewDetails",
    values: [true, false],
    choosedValue: true,
    _id: "64b6d0bea74d84f6f1c86c51",
  },
  {
    name: "Allow Parents & Students to view Tutor contact details?",
    permissionActionName: "stuParentViewDetails",
    values: [true, false],
    choosedValue: false,
    _id: "64b6d0eda74d84f6f1c86ee0",
  },
  {
    name: "Allow multiple Admins? Enabling this will let you invite additional Admins.",
    permissionActionName: "multiAdmins",
    values: [true, false],
    choosedValue: true,
    _id: "64b6d117a74d84f6f1c871de",
  },
  {
    name: "Allow Students & Parents to view correct answers?",
    permissionActionName: "stuParentViewAns",
    values: [true, false],
    choosedValue: false,
    _id: "64b6d145a74d84f6f1c8754b",
  },
  {
    name: "Allow Tutors to manage calendar and reconcile sessions?",
    permissionActionName: "tutMngCalSession",
    values: [true, false],
    choosedValue: true,
    _id: "64b6d182a74d84f6f1c87927",
  },
  {
    name: "Send Parents a reminder email before a scheduled session?",
    permissionActionName: "notifyParentBefSession",
    values: [0, 1, 6, 12, 24],
    choosedValue: 12,
    _id: "64b6d22aa74d84f6f1c88087",
  },
  {
    name: "Send Students / Parents email notification when an Admin or Tutor assigns an assignment?",
    permissionActionName: "notifyStuParentAfAssignTst",
    values: ["Only Students", "Both", "None"],
    choosedValue: "Both",
    _id: "64b6d2c3a74d84f6f1c88541",
  },
];

