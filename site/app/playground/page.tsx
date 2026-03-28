import { notFound } from "next/navigation";
import SplitHeroSection from "../_sections/SplitHeroSection/SplitHeroSection";
import { AnnouncementObj, Person, SplitHeroColumnSingleImage, SplitHeroColumnTextBlock, StrapiPicture } from "@shared/types/cms/CMSTypes";
import Chatbot from "../_features/chatbot/chatbot";
import AnnouncementCarousel from "../_components/AnnouncementCarousel/AnnouncementCarousel";
import Button from "../_components/Button/Button";
import { FeatureCardRow } from "../_components/FeatureCard/FeatureCard";
import CardSection from "../_sections/CardSection/CardSection";
import VerticalTimelineSection from "../_sections/VerticalTimelineSection/VerticalTimelineSection";
import FilterTabDemo from "./FilterTabDemo";
import { SearchBar } from "../_components/SearchBarV2/SearchBarV2";
import SearchSectionV2 from "../_sections/SearchSectionV2/SearchSectionV2";
import PersonTileCarousel from "../_components/PersonTileCarousel/PersonTileCarousel";

export default function PlaygroundPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }


  // const compL: SplitHeroColumnSingleImage = {
  //   type: "singleImage",
  //   singleImage: {
  //     image: {
  //       alternativeText: "",
  //       caption: "",
  //       formats: {},
  //       height: 0,
  //       width: 0,
  //       id: 192401924,
  //       name: "hell nah",
  //       url: "https://www.asdwa.org/wp-content/uploads/2023/06/ASDWA-Social-Logo_400x400.png",
  //     },
  //   },
  // };

  // const compR: SplitHeroColumnTextBlock = {
  //   type: 'textBlock',
  //   textBlock: {
  //     // preheader: 'method',
  //     header: '$#NApply skills$#,\\n$#PCreate Projects$#,\\n$#SMake connections$#',
  //     headerType: 'Title',
  //     subheader: 'ACM brings together students who love exploring technology, learning\n new skills, and creating real projects with others.',
  //     alignment: 'center',
  //     buttons: [],
  //     buttonsVisible: false,
  //   }
  // }

  const mockImage = {
    id: 1,
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    alternativeText: "Hackathon event banner",
    caption: "",
    width: 800,
    height: 400,
    name: "hackathon.jpg",
    formats: {},
  };

  const makeMockPicture = (id: number, url: string): StrapiPicture => ({
    id,
    url,
    alternativeText: "",
    caption: "",
    width: 400,
    height: 500,
    name: `mock-${id}.jpg`,
    formats: {},
  });

  const mockPeople: Person[] = [
    {
      name: "Ada Lovelace",
      nameShort: "Ada",
      role: "President",
      roleShort: "President",
      description:
        "Leads the chapter, coordinates events, and keeps everyone moving in the same direction. Loves Rust, ergonomic keyboards, and very long whiteboard sessions.",
      picture: makeMockPicture(
        101,
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600",
      ),
      socials: [
        { type: "linkedin", url: "https://linkedin.com" },
        { type: "github", url: "https://github.com" },
      ],
    },
    {
      name: "Grace Hopper",
      nameShort: "Grace",
      role: "Vice President",
      roleShort: "VP",
      description:
        "Runs the technical workshop track. Believes the best way to learn is to ship something embarrassingly small and then make it less embarrassing.",
      picture: makeMockPicture(
        102,
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600",
      ),
      socials: [
        { type: "linkedin", url: "https://linkedin.com" },
        { type: "x", url: "https://x.com" },
      ],
    },
    {
      name: "Alan Turing",
      nameShort: "Alan",
      role: "Treasurer",
      roleShort: "Treasurer",
      description:
        "Keeps the books, hunts down sponsors, and makes sure pizza shows up on time. Has strong opinions about decision problems and stronger ones about reimbursements.",
      picture: makeMockPicture(
        103,
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
      ),
      socials: [
        { type: "github", url: "https://github.com" },
      ],
    },
    {
      name: "Katherine Johnson",
      nameShort: "Katherine",
      role: "Outreach Lead",
      roleShort: "Outreach",
      description:
        "Builds bridges to other student orgs and industry partners. If you've been invited to something, she's probably the reason.",
      picture: makeMockPicture(
        104,
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
      ),
      socials: [
        { type: "linkedin", url: "https://linkedin.com" },
        { type: "instagram", url: "https://instagram.com" },
      ],
    },
    {
      name: "Linus Torvalds",
      nameShort: "Linus",
      role: "Projects Lead",
      roleShort: "Projects",
      description:
        "Shepherds member-led projects from idea to repo. Mentors new contributors and reviews PRs with the patience of a saint (mostly).",
      picture: makeMockPicture(
        105,
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600",
      ),
      socials: [
        { type: "github", url: "https://github.com" },
        { type: "personal_site", url: "https://example.com" },
      ],
    },
  ];

  // const announcements: AnnouncementObj[] = [
  //   {
  //     image: mockImage,
  //     title: "Spring Hackathon 2025",
  //     colorTheme: "primary",
  //     subheader: [
  //       { icon: "calendar", text: "April 12–13, 2025" },
  //       { icon: "clock", text: "9:00 AM – 5:00 PM" },
  //       { icon: "location-pin", text: "UH Engineering Building, Room 101" },
  //     ],
  //     badge: ["Hackathon", "Free Food", "Prizes"],
  //     body: "Join us for a 24-hour coding sprint! Build something cool, meet new friends, and compete for prizes. All skill levels welcome.",
  //     buttons: [
  //       { text: "Register Now", href: "#", target: "_blank", icon: "chevron-right", isIconOnRightSide: true },
  //       { text: "Learn More", href: "#", target: "_self" },
  //     ],
  //   },
  //   {
  //     image: {
  //       ...mockImage,
  //       id: 2,
  //       url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
  //       alternativeText: "Workshop banner",
  //     },
  //     title: "Intro to Machine Learning",
  //     colorTheme: "secondary",
  //     subheader: [
  //       { icon: "calendar", text: "May 3, 2025" },
  //       { icon: "location-pin", text: "Online — Zoom" },
  //     ],
  //     badge: ["Workshop", "Beginner Friendly"],
  //     body: "Learn the fundamentals of ML with hands-on Python exercises. No prior experience needed.",
  //     buttons: [
  //       { text: "RSVP", href: "#", target: "_blank" },
  //     ],
  //   },
  //   {
  //     image: {
  //       ...mockImage,
  //       id: 3,
  //       url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
  //       alternativeText: "Social event",
  //     },
  //     title: "ACM End-of-Year Social",
  //     colorTheme: 'accent',
  //     subheader: [
  //       { icon: "calendar", text: "May 20, 2025" },
  //       { icon: "clock", text: "6:00 PM" },
  //       { icon: "location-pin", text: "Student Center Ballroom" },
  //     ],
  //     badge: ["Social"],
  //     body: "Celebrate the end of the semester with the ACM community. Food, games, and good vibes.",
  //     buttons: [
  //       { text: "Add to Calendar", href: "#", target: "_self", icon: "calendar" },
  //     ],
  //   },
  // ];

  return (
    <div style={{ boxSizing: 'border-box', padding: "2rem", width: "100vw", justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      {/* <Button >Hello</Button>
      <FilterTabDemo /> */}
      <div style={{ width: "min(400px, 100%)", marginTop: "1.5rem" }}>
        <SearchBar placeholder="Search..." />
      </div>
      <div style={{height: '100vh'}} />
      <div style={{ width: "100%", maxWidth: "60rem", marginBottom: "2rem" }}>
        <h2 className="H2" style={{ textAlign: "center", marginBottom: "1rem" }}>
          PersonTileCarousel demo
        </h2>
        <PersonTileCarousel people={mockPeople} />
      </div>
      {/* <FeatureCardRow /> */}
      <CardSection
        title="$[primary](What) we $[secondary](offer)"
        subtitle="Everything you need to grow as a developer."
        sectionID="card-section-demo"
        cards={[
          { icon: "target", title: "Workshops",  subtitle: "Hands-on sessions every week",      href: "#" },
          { icon: "code",   title: "Projects",   subtitle: "Build real things with a team",     href: "#" },
          { icon: "users",  title: "Community",  subtitle: "A network that has your back" },
          { icon: "heart",  title: "Support",    subtitle: "Mentorship from day one",           href: "#" },
        ]}
      />
      <div style={{height: '100vh'}} />
      <VerticalTimelineSection
        title="Our $[primary](History)"
        subtitle="A look at how UH ACM has grown over the years."
        sectionID="timeline-demo"
        entries={[
          {
            date: "Fall 2019",
            title: "$[primary](Founded) the Chapter",
            subtitle: "UH ACM officially chartered",
            description: "A small group of students came together to establish UH's first ACM student chapter, with a mission to build a lasting tech community on campus.",
            href: "#",
          },
          {
            date: "Spring 2020",
            title: "First Hackathon",
            subtitle: "Over 80 participants",
            description: "Our inaugural hackathon drew students from across every major. Teams built projects ranging from campus navigation apps to AI study tools.",
          },
          {
            date: "Fall 2021",
            title: "$[secondary](Workshop) Series Launch",
            subtitle: "10-week curriculum, 200+ attendees",
            description: "We launched a structured workshop series covering web dev, data science, and systems — all student-led and free to attend.",
            href: "#",
          },
          {
            date: "Spring 2023",
            title: "Industry Partnerships",
            subtitle: "Connecting students with employers",
            description: "Formalized relationships with local tech companies, bringing resume reviews, mock interviews, and hiring pipelines directly to members.",
          },
          {
            date: "Fall 2024",
            title: "$[primary](New) Website",
            subtitle: "Built entirely by ACM members",
            description: "The site you're looking at right now — designed and developed in-house by a team of volunteers over one semester.",
            href: "#",
          },
        ]}
      />
      <div style={{height: '100vh'}} />
      <SearchSectionV2
        sectionID="search-v2-events-demo"
        type="events"
        title="$[primary](Past) and upcoming $[secondary](events)"
        subtitle="Workshops, hackathons, socials \\n— everything we've hosted and what's coming up next."
      />
      <SearchSectionV2
        sectionID="search-v2-qnas-demo"
        type="qnas"
        title="$[secondary](Industry) Q$[primary](&)A's"
        subtitle="Recorded conversations with engineers, founders, and alumni."
      />
      <div style={{height: '50vh'}} />
    </div>
  )

  // return (
  //   <div>
  //     <SplitHeroSection
  //       // leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={true}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //     <SplitHeroSection
  //       // leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={true}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //     <SplitHeroSection
  //       // leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={true}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //     <SplitHeroSection
  //       // leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={true}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //     <SplitHeroSection
  //       // leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={true}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //   </div>
  // );

  // const compL: SplitHeroColumnSingleImage = {
  //   type: "singleImage",
  //   singleImage: {
  //     image: {
  //       alternativeText: "",
  //       caption: "",
  //       formats: {},
  //       height: 0,
  //       width: 0,
  //       id: 192401924,
  //       name: "hell nah",
  //       url: "https://www.asdwa.org/wp-content/uploads/2023/06/ASDWA-Social-Logo_400x400.png",
  //     },
  //   },
  // };

  // const compR: SplitHeroColumnTextBlock = {
  //   type: 'textBlock',
  //   textBlock: {
  //     preheader: 'method',
  //     header: '$#PITS$#',
  //     headerType: 'H2',
  //     subheader: 'WHAT!',
  //     alignment: 'left',
  //     buttons: [],
  //     buttonsVisible: false,
  //   }
  // }

  // return (
  //   <div>
  //     <SplitHeroSection
  //       leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={false}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //   </div>
  // );
}
