import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Activity, Workflow } from 'lucide-react';
import { OverviewLoadingBlock } from './overview_loading_block';
import { StatCard } from './stat_card';
import { MonthlyChart } from './monthly_chart';
import { CategoryChart } from './category_chart';
import { TopSkillsChart } from './top_skills_chart';
import { SearchBar } from './search_bar';

const categoryDataGenerator = (applicantData) => {
  // Object to store the counts of each field
  const fieldCounts = {};
  let countOfFields = 0;

  // Iterate through the applicant data to count occurrences of each field
  applicantData.forEach(applicant => {
    const field = applicant._id;
    if (field) { // Ensure field is not null or undefined
      fieldCounts[field] = applicant.count;
      countOfFields += applicant.count;
    }
  });

  // Generate distinct colors for each category
  // This simple color generation aims for variety but might not be perfectly distinct for many categories.
  // For more sophisticated color schemes, a dedicated color library might be used.
  const generateColor = (index) => {
    const hue = (index * 137.508) % 360; // Use golden angle approximation for even distribution
    return `hsl(${hue}, 70%, 50%)`;
  };

  // Convert the fieldCounts object into the desired array format
  const formattedData = Object.keys(fieldCounts).map((field, index) => {
    return {
      name: field,
      value: ((fieldCounts[field] / countOfFields).toFixed(2) * 100),
      count: fieldCounts[field],
      color: generateColor(index)
    };
  }).sort((a, b) => {
    return b.value - a.value
  });

  return formattedData;
}

// Data Layer - Easy to replace with API calls
const useData = () => {
  // TODO: Replace with actual API calls

  // Sample user data for search functionality
  const usersData = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      status: "available",
      cv: "john_smith_cv.pdf",
      coverLetter: "john_smith_cl.pdf",
      lastUpdated: "2024-05-20",
      field: "Software Development",
      jobTitle: "Frontend Developer",
      yearsOfXp: 5,
      skills: ["React", "JavaScript", "HTML", "CSS", "UI/UX Design"],
      summary: "Experienced Frontend Developer with 5 years of building responsive and user-friendly web applications using modern JavaScript frameworks."
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      status: "available",
      cv: "sarah_j_cv.pdf",
      coverLetter: "sarah_j_cl.pdf",
      lastUpdated: "2024-06-15",
      field: "Marketing",
      jobTitle: "Digital Marketing Specialist",
      yearsOfXp: 3,
      skills: ["SEO", "Content Marketing", "Social Media Management", "Email Marketing", "Google Analytics"],
      summary: "Dynamic Digital Marketing Specialist with 3 years of experience in driving online engagement and lead generation through various digital channels."
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.wilson@example.com",
      status: "not available",
      cv: null,
      coverLetter: null,
      lastUpdated: "2023-11-01",
      field: "Finance",
      jobTitle: "Financial Analyst",
      yearsOfXp: 7,
      skills: ["Financial Modeling", "Data Analysis", "Budgeting", "Forecasting", "Excel"],
      summary: "Highly analytical Financial Analyst with 7 years of experience providing insightful financial reports and strategic recommendations to support business growth."
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.davis@example.com",
      status: "available",
      cv: "emma_d_cv.pdf",
      coverLetter: "emma_d_cl.pdf",
      lastUpdated: "2024-06-20",
      field: "Healthcare",
      jobTitle: "Registered Nurse",
      yearsOfXp: 10,
      skills: ["Patient Care", "Medication Administration", "Electronic Health Records (EHR)", "Critical Care", "First Aid"],
      summary: "Dedicated Registered Nurse with a decade of experience in various healthcare settings, committed to providing compassionate and effective patient care."
    },
    {
      id: 5,
      name: "James Brown",
      email: "james.brown@example.com",
      status: "pending",
      cv: "james_b_cv.pdf",
      coverLetter: null,
      lastUpdated: "2024-04-10",
      field: "Project Management",
      jobTitle: "Project Manager",
      yearsOfXp: 8,
      skills: ["Agile Methodologies", "Scrum", "Risk Management", "Stakeholder Communication", "Budget Management"],
      summary: "Results-driven Project Manager with 8 years of successfully leading complex projects from initiation to completion, ensuring on-time and within-budget delivery."
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      status: "available",
      cv: "lisa_a_cv.pdf",
      coverLetter: "lisa_a_cl.pdf",
      lastUpdated: "2024-06-01",
      field: "Human Resources",
      jobTitle: "HR Business Partner",
      yearsOfXp: 6,
      skills: ["Talent Acquisition", "Employee Relations", "Performance Management", "HR Policy Development", "Conflict Resolution"],
      summary: "Strategic HR Business Partner with 6 years of experience aligning HR initiatives with business objectives to foster a positive and productive work environment."
    },
    {
      id: 7,
      name: "Chris Green",
      email: "chris.g@example.com",
      status: "available",
      cv: "chris_g_cv.pdf",
      coverLetter: "chris_g_cl.pdf",
      lastUpdated: "2024-05-28",
      field: "Data Science",
      jobTitle: "Data Scientist",
      yearsOfXp: 4,
      skills: ["Talking", "Team Work", "Python", "Machine Learning", "Statistical Modeling", "Data Visualization"],
      summary: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt neque vitae odio enim labore! Ratione enim distinctio illo, error reiciendis aperiam vitae vel ducimus at expedita corporis corporis doloribus excepturi accusantium, repellendus ab, laudantium exercitationem voluptatibus animi iusto cum fugiat debitis! Reprehenderit repellat enim voluptate cupiditate. Veniam, impedit cupiditate corrupti cumque illum maxime! Nulla, sed fugiat labore minus repellendus ab. Minima minus, quidem eos dolore praesentium modi quod voluptates enim possimus, doloremque illo aliquam sint est magni deleniti repellendus voluptatum alias consectetur repellat optio, aperiam veniam aspernatur maiores adipisci. Veniam provident culpa distinctio dicta quidem, ex dignissimos expedita aperiam soluta vitae."
    },
    {
      id: 8,
      name: "Olivia White",
      email: "olivia.w@example.com",
      status: "pending",
      cv: null,
      coverLetter: null,
      lastUpdated: "2024-03-15",
      field: "Education",
      jobTitle: "High School Teacher",
      yearsOfXp: 9,
      skills: ["Curriculum Development", "Classroom Management", "Lesson Planning", "Student Assessment", "Differentiated Instruction"],
      summary: "Passionate High School Teacher with 9 years of experience fostering engaging learning environments and promoting academic excellence in diverse student populations."
    },
    {
      id: 9,
      name: "Daniel Miller",
      email: "daniel.m@example.com",
      status: "available",
      cv: "daniel_m_cv.pdf",
      coverLetter: "daniel_m_cl.pdf",
      lastUpdated: "2024-06-10",
      field: "Design",
      jobTitle: "UX/UI Designer",
      yearsOfXp: 2,
      skills: ["Wireframing", "Prototyping", "User Research", "Figma", "Adobe XD"],
      summary: "Creative UX/UI Designer with 2 years of experience crafting intuitive and visually appealing digital experiences that enhance user satisfaction."
    },
    {
      id: 10,
      name: "Sophia Martinez",
      email: "sophia.m@example.com",
      status: "available",
      cv: "sophia_m_cv.pdf",
      coverLetter: "sophia_m_cl.pdf",
      lastUpdated: "2024-05-05",
      field: "Sales",
      jobTitle: "Sales Representative",
      yearsOfXp: 3,
      skills: ["Client Relationship Management", "Negotiation", "Lead Generation", "CRM Software", "Presentation Skills"],
      summary: "Dynamic Sales Representative with 3 years of proven success in exceeding sales targets and building strong, lasting client relationships."
    },
    {
      id: 11,
      name: "Ethan Taylor",
      email: "ethan.t@example.com",
      status: "not available",
      cv: null,
      coverLetter: null,
      lastUpdated: "2023-12-20",
      field: "Engineering",
      jobTitle: "Mechanical Engineer",
      yearsOfXp: 12,
      skills: ["CAD Software", "Prototyping", "Thermodynamics", "Stress Analysis", "Project Design"],
      summary: "Experienced Mechanical Engineer with 12 years of expertise in designing, developing, and optimizing mechanical systems for various industries."
    },
    {
      id: 12,
      name: "Mia Clark",
      email: "mia.c@example.com",
      status: "available",
      cv: "mia_c_cv.pdf",
      coverLetter: "mia_c_cl.pdf",
      lastUpdated: "2024-06-22",
      field: "Customer Service",
      jobTitle: "Customer Support Lead",
      yearsOfXp: 5,
      skills: ["Conflict Resolution", "Communication Skills", "Problem-Solving", "Team Leadership", "CRM Systems"],
      summary: "Customer-focused Customer Support Lead with 5 years of experience in managing support teams and resolving complex customer inquiries efficiently."
    },
    {
      id: 13,
      name: "Noah Rodriguez",
      email: "noah.r@example.com",
      status: "pending",
      cv: "noah_r_cv.pdf",
      coverLetter: null,
      lastUpdated: "2024-04-25",
      field: "IT",
      jobTitle: "Network Administrator",
      yearsOfXp: 7,
      skills: ["Network Security", "Troubleshooting", "System Administration", "Cisco Routers", "Cloud Computing"],
      summary: "Proficient Network Administrator with 7 years of experience in designing, implementing, and maintaining robust and secure network infrastructures."
    },
    {
      id: 14,
      name: "Ava Lewis",
      email: "ava.l@example.com",
      status: "available",
      cv: "ava_l_cv.pdf",
      coverLetter: "ava_l_cl.pdf",
      lastUpdated: "2024-06-08",
      field: "Content Creation",
      jobTitle: "Content Writer",
      yearsOfXp: 4,
      skills: ["Copywriting", "SEO Writing", "Editing", "Research", "Blog Post Creation"],
      summary: "Creative Content Writer with 4 years of experience crafting compelling and engaging content for various digital platforms and audiences."
    },
    {
      id: 15,
      name: "Liam Hall",
      email: "liam.h@example.com",
      status: "available",
      cv: "liam_h_cv.pdf",
      coverLetter: "liam_h_cl.pdf",
      lastUpdated: "2024-05-18",
      field: "Research",
      jobTitle: "Research Scientist",
      yearsOfXp: 6,
      skills: ["Experimental Design", "Statistical Analysis", "Data Interpretation", "Report Writing", "Laboratory Techniques"],
      summary: "Dedicated Research Scientist with 6 years of experience conducting rigorous scientific investigations and contributing to impactful discoveries."
    },
    {
      id: 16,
      name: "Chloe Lee",
      email: "chloe.l@example.com",
      status: "available",
      cv: "chloe_l_cv.pdf",
      coverLetter: "chloe_l_cl.pdf",
      lastUpdated: "2024-06-05",
      field: "Finance",
      jobTitle: "Accountant",
      yearsOfXp: 8,
      skills: ["Financial Reporting", "Tax Preparation", "Auditing", "Bookkeeping", "GAAP"],
      summary: "Detail-oriented Accountant with 8 years of experience managing financial records, preparing statements, and ensuring compliance with regulations."
    },
    {
      id: 17,
      name: "Lucas Perez",
      email: "lucas.p@example.com",
      status: "not available",
      cv: null,
      coverLetter: null,
      lastUpdated: "2023-10-10",
      field: "Legal",
      jobTitle: "Paralegal",
      yearsOfXp: 3,
      skills: ["Legal Research", "Document Preparation", "Case Management", "Client Communication", "Litigation Support"],
      summary: "Diligent Paralegal with 3 years of experience providing comprehensive support to legal teams, including research and document management."
    },
    {
      id: 18,
      name: "Isabella King",
      email: "isabella.k@example.com",
      status: "available",
      cv: "isabella_k_cv.pdf",
      coverLetter: "isabella_k_cl.pdf",
      lastUpdated: "2024-06-18",
      field: "Marketing",
      jobTitle: "Social Media Manager",
      yearsOfXp: 2,
      skills: ["Social Media Strategy", "Content Scheduling", "Community Management", "Analytics", "Influencer Marketing"],
      summary: "Engaging Social Media Manager with 2 years of experience developing and executing successful social media campaigns to boost brand awareness and engagement."
    },
    {
      id: 19,
      name: "Jackson Scott",
      email: "jackson.s@example.com",
      status: "available",
      cv: "jackson_s_cv.pdf",
      coverLetter: "jackson_s_cl.pdf",
      lastUpdated: "2024-05-12",
      field: "Construction",
      jobTitle: "Construction Manager",
      yearsOfXp: 15,
      skills: ["Project Planning", "Site Supervision", "Budget Control", "Safety Regulations", "Contract Negotiation"],
      summary: "Highly experienced Construction Manager with 15 years in overseeing large-scale construction projects, ensuring quality, safety, and timely completion."
    },
    {
      id: 20,
      name: "Grace Baker",
      email: "grace.b@example.com",
      status: "pending",
      cv: "grace_b_cv.pdf",
      coverLetter: null,
      lastUpdated: "2024-04-01",
      field: "Education",
      jobTitle: "University Lecturer",
      yearsOfXp: 11,
      skills: ["Lecturing", "Course Design", "Academic Advising", "Research", "Public Speaking"],
      summary: "Accomplished University Lecturer with 11 years of experience in higher education, delivering engaging lectures and contributing to academic research."
    },
    {
      id: 21,
      name: "Sam Evans",
      email: "sam.e@example.com",
      status: "available",
      cv: "sam_e_cv.pdf",
      coverLetter: "sam_e_cl.pdf",
      lastUpdated: "2024-06-21",
      field: "Healthcare",
      jobTitle: "Medical Assistant",
      yearsOfXp: 1,
      skills: ["Patient Intake", "Vital Signs", "Phlebotomy", "Medical Terminology", "Appointment Scheduling"],
      summary: "Dedicated Medical Assistant with 1 year of experience providing essential support in clinical settings, ensuring efficient patient flow and care."
    },
    {
      id: 22,
      name: "Lily Adams",
      email: "lily.a@example.com",
      status: "available",
      cv: "lily_a_cv.pdf",
      coverLetter: "lily_a_cl.pdf",
      lastUpdated: "2024-05-30",
      field: "Software Development",
      jobTitle: "Backend Developer",
      yearsOfXp: 7,
      skills: ["Node.js", "Python", "Databases (SQL/NoSQL)", "API Development", "Cloud Platforms"],
      summary: "Senior Backend Developer with 7 years of experience in designing and implementing robust and scalable server-side applications."
    },
    {
      id: 23,
      name: "Oliver Wright",
      email: "oliver.w@example.com",
      status: "not available",
      cv: null,
      coverLetter: null,
      lastUpdated: "2023-09-01",
      field: "Art & Design",
      jobTitle: "Graphic Designer",
      yearsOfXp: 4,
      skills: ["Adobe Creative Suite", "Typography", "Branding", "Print Design", "Web Graphics"],
      summary: "Creative Graphic Designer with 4 years of experience producing visually compelling designs for various marketing and branding initiatives."
    },
    {
      id: 24,
      name: "Zoe Hill",
      email: "zoe.h@example.com",
      status: "available",
      cv: "zoe_h_cv.pdf",
      coverLetter: "zoe_h_cl.pdf",
      lastUpdated: "2024-06-12",
      field: "Data Science",
      jobTitle: "Machine Learning Engineer",
      yearsOfXp: 6,
      skills: ["Machine Learning Algorithms", "Deep Learning", "TensorFlow", "PyTorch", "Model Deployment"],
      summary: "Innovative Machine Learning Engineer with 6 years of experience developing and deploying advanced AI models to solve complex business problems."
    },
    {
      id: 25,
      name: "Harry Green",
      email: "harry.g@example.com",
      status: "pending",
      cv: "harry_g_cv.pdf",
      coverLetter: null,
      lastUpdated: "2024-03-20",
      field: "Logistics",
      jobTitle: "Supply Chain Manager",
      yearsOfXp: 9,
      skills: ["Inventory Management", "Logistics Optimization", "Vendor Management", "Supply Chain Analytics", "SAP"],
      summary: "Strategic Supply Chain Manager with 9 years of experience optimizing logistics operations and ensuring efficient flow of goods and services."
    },
    {
      id: 26,
      name: "Chloe Hall",
      email: "chloe.ha@example.com",
      status: "available",
      cv: "chloe_ha_cv.pdf",
      coverLetter: "chloe_ha_cl.pdf",
      lastUpdated: "2024-06-03",
      field: "Customer Service",
      jobTitle: "Call Center Agent",
      yearsOfXp: 2,
      skills: ["Active Listening", "De-escalation", "Ticketing Systems", "Product Knowledge", "Empathy"],
      summary: "Client-focused Call Center Agent with 2 years of experience providing exceptional customer support and resolving inquiries in a fast-paced environment."
    },
    {
      id: 27,
      name: "Max Turner",
      email: "max.t@example.com",
      status: "available",
      cv: "max_t_cv.pdf",
      coverLetter: "max_t_cl.pdf",
      lastUpdated: "2024-05-25",
      field: "IT",
      jobTitle: "Cybersecurity Analyst",
      yearsOfXp: 5,
      skills: ["Threat Detection", "Vulnerability Assessment", "Incident Response", "Firewalls", "Security Information and Event Management (SIEM)"],
      summary: "Proactive Cybersecurity Analyst with 5 years of experience safeguarding digital assets through comprehensive security measures and rapid incident response."
    },
    {
      id: 28,
      name: "Ruby Cooper",
      email: "ruby.c@example.com",
      status: "not available",
      cv: null,
      coverLetter: null,
      lastUpdated: "2023-08-15",
      field: "Hospitality",
      jobTitle: "Hotel Manager",
      yearsOfXp: 10,
      skills: ["Operations Management", "Staff Supervision", "Guest Relations", "Revenue Management", "Event Planning"],
      summary: "Experienced Hotel Manager with 10 years of successful leadership in hospitality, driving guest satisfaction and operational excellence."
    },
    {
      id: 29,
      name: "Oscar Ward",
      email: "oscar.w@example.com",
      status: "available",
      cv: "oscar_w_cv.pdf",
      coverLetter: "oscar_w_cl.pdf",
      lastUpdated: "2024-06-16",
      field: "Sales",
      jobTitle: "Account Executive",
      yearsOfXp: 4,
      skills: ["Strategic Selling", "Pipeline Management", "CRM Software (e.g., Salesforce)", "Closing Deals", "Client Presentations"],
      summary: "Accomplished Account Executive with 4 years of experience in driving revenue growth and cultivating strong client relationships in competitive markets."
    },
    {
      id: 30,
      name: "Poppy Bell",
      email: "poppy.b@example.com",
      status: "available",
      cv: "poppy_b_cv.pdf",
      coverLetter: "poppy_b_cl.pdf",
      lastUpdated: "2024-05-01",
      field: "Research",
      jobTitle: "Market Researcher",
      yearsOfXp: 3,
      skills: ["Market Analysis", "Survey Design", "Qualitative Research", "Quantitative Research", "Report Generation"],
      summary: "Insightful Market Researcher with 3 years of experience in conducting in-depth market analysis and providing actionable insights for business strategy."
    }
  ];

  const statsData = {
    totalUsers: usersData.length,
    uniqueFields: [...new Set(usersData.map((d) => d.jobTitle))].length,
    availableUsers: usersData.map((d) => d.status).filter(f => f === 'available').length,
    conversionRate: 3.2,
    userGrowth: 12.5,
    revenueGrowth: 8.3,
    availableGrowth: -2.1,
    conversionGrowth: 15.7
  };

  return { statsData, usersData };
};

// Main Dashboard Component
export const Dashboard = () => {
  const { statsData } = useData();
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    try {
      fetch(`/.netlify/functions/get_fields?occurrence=true`).then(res => res.json()).then(value => {
        if (value && value.body.length > 0) {
          const fieldStats = categoryDataGenerator(value.body);
          setCategoryData(fieldStats);
        }
      });
      return;
    } catch (e) {
      console.warn("Error:", e)
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      <SearchBar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid - Column on mobile, Tile view on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={statsData.totalUsers}
            growth={statsData.userGrowth}
            icon={Users}
          />
          <StatCard
            title="Field Diversity"
            value={statsData.uniqueFields}
            growth={statsData.revenueGrowth}
            icon={Workflow}
          />
          <StatCard
            title="Available Users"
            value={statsData.availableUsers}
            growth={statsData.availableGrowth}
            icon={Activity}
          />
          <StatCard
            title="Conversion Rate"
            value={statsData.conversionRate}
            growth={statsData.conversionGrowth}
            icon={TrendingUp}
            format="percentage"
          />
        </div>

        {/* Charts Grid - Column on mobile, Tile view on larger screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <MonthlyChart />
          {
            categoryData.length > 0 ?
              <CategoryChart data={categoryData} /> :
              <OverviewLoadingBlock />
          }
        </div>

        {/* Bottom Section - Column on mobile, Tile view on larger screens */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-3">
            {/* Performance Metrics */}
            <TopSkillsChart />
          </div>
        </div>
      </div>
    </div>
  );
};