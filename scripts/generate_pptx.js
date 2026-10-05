import pptxgen from "pptxgenjs";
import fs from "fs";

const pptx = new pptxgen();

// Set exact 16:9 Widescreen dimensions (13.333 x 7.5 inches)
pptx.defineLayout({ name: "FULL_HD_16_9", width: 13.333, height: 7.5 });
pptx.layout = "FULL_HD_16_9";

pptx.author = "Atharva Patil, Siddhi Pitambare, Rushikesh Kudalkar, Abhishek Ingale";
pptx.company = "Smart Neighborhood Help Network";
pptx.title = "Smart Neighborhood Help Network - Mega Project Presentation";

// Professional Modern Dark Palette
const COLORS = {
  bgDark: "090D16",      // Deepest background
  cardBg: "131B2E",      // Card container background
  cardBorder: "1E293B",  // Subtle border
  primary: "38BDF8",     // Electric Sky Blue
  secondary: "818CF8",   // Soft Indigo
  accent: "10B981",      // Emerald
  warning: "F59E0B",     // Amber
  danger: "EF4444",      // Crimson
  textLight: "F8FAFC",   // Bright white text
  textMuted: "94A3B8",   // Light grey text
  textSub: "CBD5E1"      // Secondary white
};

// Helper: Add clean header to slides
function addHeader(slide, category, title, subtitle) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 0.35,
    w: 2.3,
    h: 0.28,
    rectRadius: 0.08,
    fill: { color: "1E293B" },
    line: { color: COLORS.primary, width: 1 }
  });
  slide.addText(category, {
    x: 0.8,
    y: 0.35,
    w: 2.3,
    h: 0.28,
    fontSize: 9,
    bold: true,
    color: COLORS.primary,
    align: "center",
    valign: "middle"
  });

  slide.addText(title, {
    x: 0.8,
    y: 0.68,
    w: 11.7,
    h: 0.42,
    fontSize: 22,
    bold: true,
    color: COLORS.textLight,
    fontFace: "Arial"
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8,
      y: 1.12,
      w: 11.7,
      h: 0.28,
      fontSize: 11,
      color: COLORS.textMuted,
      fontFace: "Arial"
    });
  }
}

// =========================================================================
// SLIDE 1: TITLE & STUDENTS NAMES IN LIST FORMAT (MEGA PROJECT)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };

  // Decorative Outer Frame
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 0.45,
    w: 11.73,
    h: 6.55,
    rectRadius: 0.18,
    fill: { color: "0F172A" },
    line: { color: "38BDF8", width: 1.5 }
  });

  // Mega Project Tag Pill
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.2,
    y: 0.8,
    w: 2.8,
    h: 0.34,
    rectRadius: 0.06,
    fill: { color: "0284C7" }
  });
  slide.addText("MEGA PROJECT PRESENTATION", {
    x: 1.2,
    y: 0.8,
    w: 2.8,
    h: 0.34,
    fontSize: 9.5,
    bold: true,
    color: "FFFFFF",
    align: "center",
    valign: "middle"
  });

  // Project Main Title
  slide.addText("SMART NEIGHBORHOOD\nHELP NETWORK", {
    x: 1.2,
    y: 1.25,
    w: 10.5,
    h: 1.15,
    fontSize: 32,
    bold: true,
    color: COLORS.textLight,
    fontFace: "Arial",
    lineSpacingMultiple: 1.05
  });

  // Tagline
  slide.addText("Hyperlocal Community Service & Emergency Assistance Platform", {
    x: 1.2,
    y: 2.45,
    w: 10.5,
    h: 0.35,
    fontSize: 13,
    color: COLORS.primary,
    fontFace: "Arial"
  });

  // Divider Line
  slide.addShape(pptx.shapes.LINE, {
    x: 1.2,
    y: 2.9,
    w: 10.9,
    h: 0,
    line: { color: "334155", width: 1.2 }
  });

  // Presented By Section (List Format)
  slide.addText("PRESENTED BY:", {
    x: 1.2,
    y: 3.15,
    w: 4.0,
    h: 0.3,
    fontSize: 11,
    bold: true,
    color: COLORS.secondary
  });

  // 4 Student Names in a Clean 2-Column List Layout
  const students = [
    { num: "01", name: "Atharva Patil", color: "38BDF8" },
    { num: "02", name: "Siddhi Pitambare", color: "EC4899" },
    { num: "03", name: "Rushikesh Kudalkar", color: "10B981" },
    { num: "04", name: "Abhishek Ingale", color: "F59E0B" }
  ];

  students.forEach((st, idx) => {
    const col = idx % 2; // 0 or 1
    const row = Math.floor(idx / 2); // 0 or 1
    const listX = 1.2 + col * 5.6;
    const listY = 3.65 + row * 1.35;
    const listW = 5.3;
    const listH = 1.05;

    // List item pill box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: listX,
      y: listY,
      w: listW,
      h: listH,
      rectRadius: 0.1,
      fill: { color: COLORS.cardBg },
      line: { color: st.color, width: 1.2 }
    });

    // Number bullet badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: listX + 0.25,
      y: listY + 0.25,
      w: 0.7,
      h: 0.55,
      rectRadius: 0.08,
      fill: { color: "0F172A" },
      line: { color: st.color, width: 1 }
    });
    slide.addText(st.num, {
      x: listX + 0.25,
      y: listY + 0.25,
      w: 0.7,
      h: 0.55,
      fontSize: 12,
      bold: true,
      color: st.color,
      align: "center",
      valign: "middle"
    });

    // Student Name in List
    slide.addText(st.name, {
      x: listX + 1.2,
      y: listY + 0.25,
      w: listW - 1.4,
      h: 0.55,
      fontSize: 15,
      bold: true,
      color: COLORS.textLight,
      valign: "middle"
    });
  });
}

// =========================================================================
// SLIDE 2: WHAT IS THE PROJECT IN SHORT?
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  addHeader(slide, "PROJECT OVERVIEW", "What is the Project in Short?", "A quick look at the core idea, problem, and proposed solution.");

  const concepts = [
    {
      title: "Core Purpose",
      color: "38BDF8",
      points: [
        "Hyperlocal web application for residential neighborhoods.",
        "Connects residents with verified nearby local technicians and workers.",
        "Provides 1-click Emergency SOS broadcast for urgent domestic hazards."
      ]
    },
    {
      title: "Problem Statement",
      color: "EF4444",
      points: [
        "Unreliable contact directories with unverified service workers.",
        "No real-time visibility of available help nearby.",
        "Delayed assistance during critical home emergencies.",
        "Heavy brokerage fees charged by aggregator platforms."
      ]
    },
    {
      title: "Our Solution",
      color: "10B981",
      points: [
        "Interactive 3D spatial map showing live nearby worker availability.",
        "100% background-verified professionals with clear ratings.",
        "Direct multi-tier booking with upfront dynamic cost estimates.",
        "Instant emergency broadcast dispatch to nearest responders."
      ]
    }
  ];

  concepts.forEach((col, idx) => {
    const cardX = 0.8 + idx * 3.95;
    const cardY = 1.55;
    const cardW = 3.8;
    const cardH = 5.25;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      rectRadius: 0.15,
      fill: { color: COLORS.cardBg },
      line: { color: col.color, width: 1.5 }
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cardX + 0.3,
      y: cardY + 0.3,
      w: cardW - 0.6,
      h: 0.42,
      rectRadius: 0.08,
      fill: { color: "0F172A" },
      line: { color: col.color, width: 1 }
    });
    slide.addText(col.title, {
      x: cardX + 0.3,
      y: cardY + 0.3,
      w: cardW - 0.6,
      h: 0.42,
      fontSize: 13,
      bold: true,
      color: col.color,
      align: "center",
      valign: "middle"
    });

    const formattedPoints = col.points.map(pt => `• ${pt}\n`).join("\n");
    slide.addText(formattedPoints, {
      x: cardX + 0.3,
      y: cardY + 0.95,
      w: cardW - 0.6,
      h: 3.9,
      fontSize: 11,
      color: COLORS.textSub,
      lineSpacingMultiple: 1.2
    });
  });
}

// =========================================================================
// SLIDE 3: PROJECT PROGRESS IN % (REALISTIC OVERALL 40%)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  addHeader(slide, "PROGRESS METRICS", "Project Progress Status (in %)", "Current implementation status across all subsystems of the complete project.");

  // Left Overall Card
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.55,
    w: 3.7,
    h: 5.25,
    rectRadius: 0.15,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.primary, width: 2 }
  });

  slide.addText("OVERALL PROJECT PROGRESS", {
    x: 1.0,
    y: 1.9,
    w: 3.3,
    h: 0.3,
    fontSize: 11,
    bold: true,
    color: COLORS.secondary,
    align: "center"
  });

  slide.addText("40%", {
    x: 1.0,
    y: 2.3,
    w: 3.3,
    h: 1.1,
    fontSize: 54,
    bold: true,
    color: COLORS.primary,
    align: "center",
    fontFace: "Arial"
  });

  slide.addText("Current Development Phase", {
    x: 1.0,
    y: 3.5,
    w: 3.3,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: COLORS.accent,
    align: "center"
  });

  slide.addText(
    "• Frontend client UI & 3D spatial prototypes are completed.\n\n" +
    "• Core backend services, database schema, and payment pipelines are currently in active development.",
    {
      x: 1.0,
      y: 3.95,
      w: 3.3,
      h: 2.5,
      fontSize: 10.5,
      color: COLORS.textMuted,
      lineSpacingMultiple: 1.2
    }
  );

  // Right Side: Subsystem Breakdown
  const progressItems = [
    { name: "Frontend UI & Web Application Layouts", pct: 75, color: "10B981", status: "Built & Interactive" },
    { name: "3D Spatial Neighborhood Scene", pct: 70, color: "38BDF8", status: "Prototype Ready" },
    { name: "Service Directory & Multi-Tier Booking Logic", pct: 60, color: "818CF8", status: "Client Logic Ready" },
    { name: "Emergency SOS Dispatch Beacon Module", pct: 50, color: "F59E0B", status: "UI & State Ready" },
    { name: "Backend REST APIs & WebSockets", pct: 20, color: "EC4899", status: "In Progress" },
    { name: "Database Schema & User Authentication", pct: 15, color: "EF4444", status: "Upcoming Phase" }
  ];

  progressItems.forEach((item, idx) => {
    const cardY = 1.55 + idx * 0.86;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 4.8,
      y: cardY,
      w: 7.7,
      h: 0.76,
      rectRadius: 0.08,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.cardBorder, width: 1 }
    });

    const fillWidth = (7.4 * item.pct) / 100;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 4.95,
      y: cardY + 0.48,
      w: fillWidth,
      h: 0.14,
      rectRadius: 0.07,
      fill: { color: item.color }
    });

    slide.addText(item.name, {
      x: 4.95,
      y: cardY + 0.08,
      w: 5.2,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: COLORS.textLight
    });

    slide.addText(item.status, {
      x: 9.2,
      y: cardY + 0.08,
      w: 2.1,
      h: 0.3,
      fontSize: 9.5,
      color: COLORS.textMuted,
      align: "right"
    });

    slide.addText(`${item.pct}%`, {
      x: 11.3,
      y: cardY + 0.06,
      w: 1.0,
      h: 0.32,
      fontSize: 12,
      bold: true,
      color: item.color,
      align: "right"
    });
  });
}

// =========================================================================
// SLIDE 4: KEY ACHIEVEMENTS (FEATURE-FOCUSED)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  addHeader(slide, "COMPLETED FEATURES", "Key Achievements: Features Built Till Now", "Essential functionalities built and operating in the current web application.");

  const features = [
    {
      title: "1. 3D Spatial Map Discovery",
      color: "38BDF8",
      points: [
        "Visual 3D neighborhood view showing nearby service workers.",
        "Interactive markers displaying live status (Available, On-Job, Emergency)."
      ]
    },
    {
      title: "2. Emergency SOS Alert System",
      color: "EF4444",
      points: [
        "1-touch urgent emergency broadcast for rapid assistance.",
        "Prioritizes nearest certified responders for plumbing, electric, or safety risks."
      ]
    },
    {
      title: "3. Multi-Tier Service Booking",
      color: "10B981",
      points: [
        "Offers Standard, Priority, and Emergency service tiers.",
        "Dynamic upfront price estimation and unique booking confirmation code."
      ]
    },
    {
      title: "4. Verified Professional Directory",
      color: "818CF8",
      points: [
        "Categorized search across 8+ local service sectors.",
        "Displays worker ratings, completed jobs count, and verified skills."
      ]
    },
    {
      title: "5. Worker Registration & Onboarding",
      color: "F59E0B",
      points: [
        "Dedicated onboarding form for local workers to register their services.",
        "Allows tradespeople to list hourly rates, service areas, and contact details."
      ]
    },
    {
      title: "6. Pro Income Calculator",
      color: "06B6D4",
      points: [
        "Interactive calculator for technicians to project monthly and annual income.",
        "Dynamic computation based on hourly rates and jobs per week."
      ]
    }
  ];

  features.forEach((feat, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const cardX = 0.8 + col * 3.95;
    const cardY = 1.55 + row * 2.65;
    const cardW = 3.8;
    const cardH = 2.45;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      rectRadius: 0.15,
      fill: { color: COLORS.cardBg },
      line: { color: feat.color, width: 1.2 }
    });

    slide.addText(feat.title, {
      x: cardX + 0.2,
      y: cardY + 0.18,
      w: cardW - 0.4,
      h: 0.35,
      fontSize: 12.5,
      bold: true,
      color: feat.color
    });

    const body = feat.points.map(pt => `• ${pt}\n`).join("\n");
    slide.addText(body, {
      x: cardX + 0.2,
      y: cardY + 0.6,
      w: cardW - 0.4,
      h: 1.7,
      fontSize: 10.5,
      color: COLORS.textSub,
      lineSpacingMultiple: 1.15
    });
  });
}

// =========================================================================
// SLIDE 5: TECHNOLOGIES USED (CLEAN NAMES)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  addHeader(slide, "TECH STACK", "Technologies & Tools Used", "Core programming languages, frameworks, and graphics libraries used in the project.");

  const techCategories = [
    {
      category: "Frontend Development",
      color: "38BDF8",
      items: ["React", "TypeScript", "Vite", "HTML5 / CSS3"]
    },
    {
      category: "3D & Visual Graphics",
      color: "818CF8",
      items: ["Three.js", "React Three Fiber", "React Three Drei", "WebGL Shaders"]
    },
    {
      category: "Styling & UI Library",
      color: "10B981",
      items: ["Tailwind CSS", "Framer Motion", "Lucide React Icons", "PostCSS"]
    },
    {
      category: "Backend & Database (In Progress)",
      color: "F59E0B",
      items: ["Node.js", "Express", "WebSockets / Socket.io", "PostgreSQL"]
    }
  ];

  techCategories.forEach((cat, idx) => {
    const cardX = 0.8 + idx * 2.95;
    const cardY = 1.55;
    const cardW = 2.85;
    const cardH = 5.25;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      rectRadius: 0.15,
      fill: { color: COLORS.cardBg },
      line: { color: cat.color, width: 1.5 }
    });

    slide.addText(cat.category, {
      x: cardX + 0.15,
      y: cardY + 0.25,
      w: cardW - 0.3,
      h: 0.5,
      fontSize: 12,
      bold: true,
      color: cat.color,
      align: "center"
    });

    cat.items.forEach((item, iIdx) => {
      const itemY = cardY + 0.95 + iIdx * 1.0;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX + 0.2,
        y: itemY,
        w: cardW - 0.4,
        h: 0.8,
        rectRadius: 0.08,
        fill: { color: "0F172A" },
        line: { color: "334155", width: 1 }
      });

      slide.addText(item, {
        x: cardX + 0.2,
        y: itemY,
        w: cardW - 0.4,
        h: 0.8,
        fontSize: 12,
        bold: true,
        color: COLORS.textLight,
        align: "center",
        valign: "middle"
      });
    });
  });
}

// =========================================================================
// SLIDE 6: 2 SYSTEM WORKFLOWS (USER & WORKER)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  addHeader(slide, "WORKFLOWS", "System Workflows: User & Worker", "Step-by-step operational flow for neighborhood residents and service professionals.");

  // Top Section: USER WORKFLOW
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.55,
    w: 11.73,
    h: 2.5,
    rectRadius: 0.15,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.primary, width: 1.2 }
  });

  slide.addText("👤 USER / RESIDENT WORKFLOW", {
    x: 1.1,
    y: 1.7,
    w: 6.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: COLORS.primary
  });

  const userSteps = [
    { step: "Step 1", title: "Browse & Search", desc: "View 3D map or search directory for required service." },
    { step: "Step 2", title: "Select Service Tier", desc: "Choose Standard, Priority, or trigger 1-click Emergency SOS." },
    { step: "Step 3", title: "Confirm Booking", desc: "Select time slot, enter address, and get dynamic cost estimate." },
    { step: "Step 4", title: "Service & Review", desc: "Worker arrives, job completed, user leaves verified review." }
  ];

  userSteps.forEach((st, idx) => {
    const stepX = 1.1 + idx * 2.85;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: stepX,
      y: 2.1,
      w: 2.7,
      h: 1.75,
      rectRadius: 0.08,
      fill: { color: "0F172A" },
      line: { color: "334155", width: 1 }
    });

    slide.addText(st.step, {
      x: stepX + 0.15,
      y: 2.2,
      w: 2.4,
      h: 0.25,
      fontSize: 9.5,
      bold: true,
      color: COLORS.primary
    });

    slide.addText(st.title, {
      x: stepX + 0.15,
      y: 2.48,
      w: 2.4,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: COLORS.textLight
    });

    slide.addText(st.desc, {
      x: stepX + 0.15,
      y: 2.8,
      w: 2.4,
      h: 0.95,
      fontSize: 9.5,
      color: COLORS.textMuted
    });
  });

  // Bottom Section: WORKER WORKFLOW
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 4.25,
    w: 11.73,
    h: 2.5,
    rectRadius: 0.15,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.accent, width: 1.2 }
  });

  slide.addText("🛠️ WORKER / PROFESSIONAL WORKFLOW", {
    x: 1.1,
    y: 4.4,
    w: 6.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: COLORS.accent
  });

  const workerSteps = [
    { step: "Step 1", title: "Registration & KYC", desc: "Register skills, service category, hourly rate, and ID proof." },
    { step: "Step 2", title: "Live Availability", desc: "Toggle active status on the neighborhood map to receive requests." },
    { step: "Step 3", title: "Accept Request / SOS", desc: "Receive instant notification for standard bookings or SOS alerts." },
    { step: "Step 4", title: "Job Execution & Pay", desc: "Complete task at location, receive payment, and build reputation." }
  ];

  workerSteps.forEach((st, idx) => {
    const stepX = 1.1 + idx * 2.85;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: stepX,
      y: 4.8,
      w: 2.7,
      h: 1.75,
      rectRadius: 0.08,
      fill: { color: "0F172A" },
      line: { color: "334155", width: 1 }
    });

    slide.addText(st.step, {
      x: stepX + 0.15,
      y: 4.9,
      w: 2.4,
      h: 0.25,
      fontSize: 9.5,
      bold: true,
      color: COLORS.accent
    });

    slide.addText(st.title, {
      x: stepX + 0.15,
      y: 5.18,
      w: 2.4,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: COLORS.textLight
    });

    slide.addText(st.desc, {
      x: stepX + 0.15,
      y: 5.5,
      w: 2.4,
      h: 0.95,
      fontSize: 9.5,
      color: COLORS.textMuted
    });
  });
}

// =========================================================================
// SLIDE 7: FUTURE ROADMAP & REMAINING WORK
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  addHeader(slide, "FUTURE ROADMAP", "What We Are Going to Do Next", "Key remaining modules and milestones to complete the full-fledged web application.");

  const roadmap = [
    {
      phase: "Phase 1",
      title: "Backend API & WebSockets",
      color: "38BDF8",
      items: [
        "Build Node.js and Express REST API.",
        "Implement WebSocket server for live worker location and real-time SOS alerts.",
        "Connect client state to live backend."
      ]
    },
    {
      phase: "Phase 2",
      title: "Database & Authentication",
      color: "818CF8",
      items: [
        "Design PostgreSQL database schema.",
        "Implement secure JWT authentication for Residents and Workers.",
        "Worker document and KYC verification storage."
      ]
    },
    {
      phase: "Phase 3",
      title: "Payment Gateway Integration",
      color: "10B981",
      items: [
        "Integrate payment gateway (Razorpay / Stripe).",
        "Implement escrow holding until job completion sign-off.",
        "Automated worker payout mechanism."
      ]
    },
    {
      phase: "Phase 4",
      title: "Full App Testing & Mobile PWA",
      color: "F59E0B",
      items: [
        "End-to-end integration and load testing.",
        "Cross-platform Progressive Web App (PWA) deployment.",
        "Push notifications for mobile devices."
      ]
    }
  ];

  roadmap.forEach((item, idx) => {
    const cardX = 0.8 + idx * 2.95;
    const cardY = 1.55;
    const cardW = 2.85;
    const cardH = 5.25;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      rectRadius: 0.15,
      fill: { color: COLORS.cardBg },
      line: { color: item.color, width: 1.5 }
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cardX + 0.2,
      y: cardY + 0.25,
      w: cardW - 0.4,
      h: 0.32,
      rectRadius: 0.08,
      fill: { color: "0F172A" },
      line: { color: item.color, width: 1 }
    });
    slide.addText(item.phase, {
      x: cardX + 0.2,
      y: cardY + 0.25,
      w: cardW - 0.4,
      h: 0.32,
      fontSize: 9.5,
      bold: true,
      color: item.color,
      align: "center",
      valign: "middle"
    });

    slide.addText(item.title, {
      x: cardX + 0.2,
      y: cardY + 0.7,
      w: cardW - 0.4,
      h: 0.65,
      fontSize: 12,
      bold: true,
      color: COLORS.textLight,
      align: "center"
    });

    const body = item.items.map(it => `• ${it}\n`).join("\n");
    slide.addText(body, {
      x: cardX + 0.2,
      y: cardY + 1.45,
      w: cardW - 0.4,
      h: 3.4,
      fontSize: 10.5,
      color: COLORS.textSub,
      lineSpacingMultiple: 1.2
    });
  });
}

// =========================================================================
// SLIDE 8: SUMMARY & CONCLUSION
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  addHeader(slide, "CONCLUSION", "Project Summary", "Brief summary of key takeaways, expected impact, and project status.");

  const summaryPoints = [
    {
      title: "Community Impact",
      color: "38BDF8",
      text: "Creates a safe, self-reliant neighborhood network connecting residents directly with vetted local professionals and fast emergency assistance."
    },
    {
      title: "Technical Innovation",
      color: "10B981",
      text: "Combines 3D spatial mapping with dynamic real-time booking and SOS dispatch to provide an intuitive user experience."
    },
    {
      title: "Current Status & Vision",
      color: "818CF8",
      text: "Interactive frontend prototype completed (~40% total project); currently advancing toward backend, database, and payment integration."
    }
  ];

  summaryPoints.forEach((card, idx) => {
    const cardX = 0.8 + idx * 3.95;
    const cardY = 1.55;
    const cardW = 3.8;
    const cardH = 3.5;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      rectRadius: 0.15,
      fill: { color: COLORS.cardBg },
      line: { color: card.color, width: 1.5 }
    });

    slide.addText(card.title, {
      x: cardX + 0.25,
      y: cardY + 0.3,
      w: cardW - 0.5,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: card.color
    });

    slide.addText(card.text, {
      x: cardX + 0.25,
      y: cardY + 0.85,
      w: cardW - 0.5,
      h: 2.3,
      fontSize: 11,
      color: COLORS.textSub,
      lineSpacingMultiple: 1.25
    });
  });

  // Bottom Thank You Card
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 5.3,
    w: 11.73,
    h: 1.5,
    rectRadius: 0.15,
    fill: { color: "0F172A" },
    line: { color: COLORS.primary, width: 1.5 }
  });

  slide.addText("THANK YOU! ANY QUESTIONS?", {
    x: 1.0,
    y: 5.45,
    w: 11.3,
    h: 0.45,
    fontSize: 20,
    bold: true,
    color: COLORS.textLight,
    align: "center"
  });

  slide.addText(
    "Atharva Patil  •  Siddhi Pitambare  •  Rushikesh Kudalkar  •  Abhishek Ingale",
    {
      x: 1.0,
      y: 6.05,
      w: 11.3,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: COLORS.primary,
      align: "center"
    }
  );
}

// Generate PPTX file
const outputPath = "./Smart_Neighborhood_Help_Network_Presentation_v2.pptx";
pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`Presentation generated successfully at: ${fileName}`);
    try {
      fs.copyFileSync(fileName, "./Smart_Neighborhood_Help_Network_Presentation.pptx");
      console.log("Updated main Smart_Neighborhood_Help_Network_Presentation.pptx as well.");
    } catch (e) {
      console.log("Note: Main file is open in PowerPoint. Saved to _v2.pptx.");
    }
  })
  .catch(err => {
    console.error("Error generating presentation:", err);
    process.exit(1);
  });
