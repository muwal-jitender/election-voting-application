import Candidate1 from "../assets/candidate-1.jpeg";
import Candidate2 from "../assets/candidate-2.jpeg";
import Candidate3 from "../assets/candidate-3.jpeg";
import Candidate4 from "../assets/candidate-4.jpeg";
import Candidate5 from "../assets/candidate-5.jpeg";
import Candidate6 from "../assets/candidate-6.jpeg";
import Candidate7 from "../assets/candidate-7.jpeg";
import Thumbnail1 from "../assets/american-flag.png";
import Thumbnail2 from "../assets/flag_of_alabama.png";
import Thumbnail3 from "../assets/flag_of_alaska.png";
import Thumbnail4 from "../assets/flag_of_the_state_of_georgia.png";

export const elections = [
  {
    id: "e1",
    title: "Harvard Presidential Elections 2024",
    description:
      "Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid.",
    thumbnail: Thumbnail2,
    candidates: ["c1", "c2", "c3", "c4"],
    voters: [],
  },
  {
    id: "e2",
    title: "Legon SRC Presidential Elections 2024",
    description:
      "Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid.",
    thumbnail: Thumbnail3,
    candidates: ["c5", "c6", "c7"],
    voters: [],
  },
  {
    id: "e3",
    title: "Stanford Presidential Elections 2024",
    description:
      "Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid.",
    thumbnail: Thumbnail3,
    candidates: [],
    voters: [],
  },
];

export const candidates = [
  {
    id: "c1",
    fullName: "Enoch Ganyo",
    image: Candidate1,
    motto:
      "Sed quibusdam recusandae alias error harum maxime adipisci amet laborum.",
    voteCount: 23,
    electionId: "e1",
  },
  {
    id: "c2",
    fullName: "John Asiama",
    image: Candidate2,
    motto:
      "Sed quibusdam recusandae alias error harum maxime adipisci amet laborum.",
    voteCount: 18,
    electionId: "e2",
  },
  {
    id: "c3",
    fullName: "Dora Stephenson",
    image: Candidate3,
    motto:
      "Sed quibusdam recusandae alias error harum maxime adipisci amet laborum.",
    voteCount: 78,
    electionId: "e3",
  },
  {
    id: "c4",
    fullName: "Chairman Wobetumi",
    image: Candidate4,
    motto:
      "Sed quibusdam recusandae alias error harum maxime adipisci amet laborum.",
    voteCount: 55,
    electionId: "e1",
  },
  {
    id: "c5",
    fullName: "Anu Maurya",
    image: Candidate5,
    motto:
      "Sed quibusdam recusandae alias error harum maxime adipisci amet laborum.",
    voteCount: 258,
    electionId: "e2",
  },
  {
    id: "c6",
    fullName: "John Doe",
    image: Candidate6,
    motto:
      "Sed quibusdam recusandae alias error harum maxime adipisci amet laborum.",
    voteCount: 189,
    electionId: "e2",
  },
  {
    id: "c7",
    fullName: "Chaminda Vas",
    image: Candidate6,
    motto:
      "Sed quibusdam recusandae alias error harum maxime adipisci amet laborum.",
    voteCount: 145,
    electionId: "e2",
  },
];

export const voters = [
  {
    id: "v1",
    fullName: "Ernest Achiever",
    email: "achiever@gmail.com",
    password: "Ai@12345",
    isAdmin: true,
    votedElectionIds: ["e1"],
  },
  {
    id: "v2",
    fullName: "Jim Carry",
    email: "jim@gmail.com",
    password: "Ai@12345",
    isAdmin: false,
    votedElectionIds: ["e1", "e2"],
  },
  {
    id: "v3",
    fullName: "Daniel Vinyo",
    email: "daniel@gmail.com",
    password: "daniel123",
    isAdmin: false,
    votedElectionIds: ["e1", "e2"],
  },
  {
    id: "v4",
    fullName: "Diana Ayi",
    email: "diana@gmail.com",
    password: "diana123",
    isAdmin: true,
    votedElectionIds: [],
  },
];
