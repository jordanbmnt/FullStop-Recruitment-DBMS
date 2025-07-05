import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Activity, ArrowUpRight, ArrowDownRight, RefreshCw, Search, Workflow } from 'lucide-react';
import CandidateDetailsModal from '../../components/candidate_details_modal';

const categoryDataGenerator = (applicantData) => {
  // Object to store the counts of each field
  const fieldCounts = {};

  // Iterate through the applicant data to count occurrences of each field
  applicantData.forEach(applicant => {
    const field = applicant.field;
    if (field) { // Ensure field is not null or undefined
      fieldCounts[field] = (fieldCounts[field] || 0) + 1;
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
      value: fieldCounts[field],
      color: generateColor(index)
    };
  });

  return formattedData;
}

const monthlyApplicantData = (applicantData) => {
  // Mapping for month numbers to short month names
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Object to store aggregated data by month
  const monthlyData = {};

  // Initialize monthlyData for the months we are interested in, to ensure all months appear
  // assuming data for current year up to June based on provided sample data.
  // In a real application, you might dynamically determine the range.
  for (let i = 0; i < 6; i++) { // For Jan to Jun
    monthlyData[monthNames[i]] = {
      month: monthNames[i],
      users: 0,
      revenue: 0
    };
  }

  applicantData.forEach(applicant => {
    // Only consider available applicants for this aggregation
    if (applicant.status === 'available' && applicant.lastUpdated) {
      const date = new Date(applicant.lastUpdated);
      const monthIndex = date.getMonth(); // 0 for Jan, 1 for Feb, etc.
      const monthName = monthNames[monthIndex];

      // Ensure the month exists in our initialized data structure
      if (monthlyData[monthName]) {
        monthlyData[monthName].users += 1;
        // Simulate revenue: higher years of experience means higher simulated "value"
        // Using 1000 as a base multiplier for yearsOfXp for revenue simulation
        monthlyData[monthName].revenue += (applicant.yearsOfXp || 0) * 1000;
      }
    }
  });

  // Convert the aggregated object into an array
  const formattedData = Object.values(monthlyData);

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

  const monthlyData = monthlyApplicantData(usersData);

  const categoryData = categoryDataGenerator(usersData);

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

  return { statsData, monthlyData, categoryData, usersData };
};

const SearchResult = ({ searchResult, setSearchResult }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'not available':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 transform-gpu">
      {/* Header Section - Compact */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-base font-semibold text-gray-900 truncate leading-tight">
            {searchResult.name}
          </h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {searchResult.email}
          </p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border flex-shrink-0 transition-all duration-200 ${getStatusColor(searchResult.status)}`}>
          {searchResult.status}
        </span>
      </div>

      {/* Details Grid - Compact Layout */}
      <div className="grid grid-cols-1 gap-2 mb-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs">Field</span>
          <span className="text-gray-900 font-medium text-right truncate ml-2">{searchResult.field}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs">Experience</span>
          <span className="text-gray-900 text-right">{searchResult.yearsOfXp} years</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs">Updated</span>
          <span className="text-gray-600 text-right text-xs">{searchResult.lastUpdated}</span>
        </div>
      </div>

      {/* Action Button - Compact */}
      <button
        onClick={() => {
          setSearchResult()
        }}
        className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transform-gpu"
      >
        View Details
      </button>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, growth, icon: Icon, format = 'number' }) => {
  const isPositive = growth > 0;
  const formattedValue = format === 'currency'
    ? `R${value.toLocaleString()}`
    : format === 'percentage'
      ? `${value}%`
      : value.toLocaleString();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formattedValue}</p>
        </div>
        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-sm font-medium ml-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(growth)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  );
};

// Chart Components
const MonthlyChart = ({ data }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const CategoryChart = ({ data }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex justify-center space-x-4 mt-4">
      {data.slice(0, 4).map((entry, index) => (
        <div key={index} className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-sm text-gray-600">{entry.name} ({entry.value}%)</span>
        </div>
      ))}
    </div>
  </div>
);

// Main Dashboard Component
export const Dashboard = () => {
  const { statsData, monthlyData, categoryData, usersData } = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryMaxLength, setSearchQueryMaxLength] = useState(0);
  const [searchQueryLimit, setSearchQueryLimit] = useState(2);
  const [searchResult, setSearchResult] = useState(null);
  const [activeSearchResult, setActiveSearchResult] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      // Search users by name or email
      const foundUser = usersData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.yearsOfXp === searchQuery
      ).sort((a, b) => {
        return b.yearsOfXp - a.yearsOfXp
      });

      setSearchQueryMaxLength(foundUser.length)
      setSearchResult(foundUser.slice(0, searchQueryLimit));
    }
  }, [searchQuery, searchQueryLimit, usersData]);

  //! REMOVE
  (async () => {
    try {
      const a = await fetch('/.netlify/functions/get_cv_users?field=software').then((response) => response.json())
      console.warn(a)
    } catch (e) {
      console.warn("Error:", e)
    }
  })()

  const handleShowMore = () => {
    const nextIncrement = searchQueryLimit + 5;
    console.warn(nextIncrement)
    if (nextIncrement <= searchQueryMaxLength) setSearchQueryLimit(nextIncrement);
    else if (nextIncrement > searchQueryMaxLength && searchQueryLimit !== searchQueryMaxLength) setSearchQueryLimit(searchQueryMaxLength)
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      // In real app, this would trigger data refetch
    }, 1000);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (searchQueryLimit > 2) setSearchQueryLimit(2)
    if (!query.trim()) {
      setSearchResult(null);
      return;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
            <div className="mb-6">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Welcome Back!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Here's a comprehensive overview of your business performance and key metrics for today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-left">
                  <p className="text-sm text-gray-500 font-medium">Last Updated</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed group"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
                <span className="font-medium">{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for users by name or email..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-6 animate-in slide-in-from-top-2 fade-in-0 duration-500 ease-out">
              {searchResult ? (
                <div className="space-y-4">
                  {/* Results Header */}
                  <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-1 duration-400 delay-200 ease-out">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Search Results
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Found {searchResult.length} {searchResult.length === 1 ? 'user' : 'users'} matching "{searchQuery}"
                      </p>
                    </div>
                  </div>

                  {/* Results List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {searchResult.map((r, index) => (
                      <div
                        key={index}
                        className="animate-in fade-in-0 slide-in-from-bottom-3 duration-400 ease-out"
                        style={{
                          animationDelay: `${300 + index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <SearchResult searchResult={r} setSearchResult={() => {
                          setActiveSearchResult(r);
                          setIsModalVisible(true)
                        }} />
                      </div>
                    ))}
                  </div>

                  {/* Load More Section */}
                  {searchResult.length > 0 && (
                    <div
                      className="pt-6 border-t border-gray-200 animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out"
                      style={{
                        animationDelay: `${400 + searchResult.length * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="text-center">
                        <button
                          onAuxClick={(e) => {
                            // ask for increment and sort
                            window.alert("MWAHAHAH")
                          }}
                          disabled={searchQueryLimit === searchQueryMaxLength}
                          onClick={() => { handleShowMore() }}
                          className={`group inline-flex items-center px-6 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white ${searchQueryLimit === searchQueryMaxLength ? 'text-gray-100' : 'text-gray-700 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-out'}`}
                        >
                          <svg className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Show More Results
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          Showing {searchResult.length} results of {searchQueryMaxLength}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* No Results State */
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center animate-in fade-in-0 zoom-in-95 duration-500 delay-300 ease-out">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 animate-in fade-in-0 scale-in-0 duration-300 delay-600">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-400 delay-700 ease-out">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No users found
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      We couldn't find any users matching "{searchQuery}". Try adjusting your search terms.
                    </p>
                  </div>
                  <div className="space-y-2 text-xs text-gray-400">
                    <p className="opacity-0 animate-in fade-in-0 duration-300 delay-900" style={{ animationFillMode: 'forwards' }}>• Check for typos in your search</p>
                    <p className="opacity-0 animate-in fade-in-0 duration-300 delay-1000" style={{ animationFillMode: 'forwards' }}>• Try using different keywords</p>
                    <p className="opacity-0 animate-in fade-in-0 duration-300 delay-1100" style={{ animationFillMode: 'forwards' }}>• Use fewer words in your search</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CandidateDetailsModal candidate={activeSearchResult} isOpen={isModalVisible} onClose={() => {
        setIsModalVisible(false);
        setActiveSearchResult(null)
      }} />

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
            title="available Users"
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
          <MonthlyChart data={monthlyData} />
          <CategoryChart data={categoryData} />
        </div>

        {/* Bottom Section - Column on mobile, Tile view on larger screens */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-3">
            {/* Performance Metrics */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};