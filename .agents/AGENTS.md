# Workspace memory rules: huaR Web App

This project is a localized Framer-exported web application rebranded for **huaR** (`huar.org` / `huar.in`).

## Critical Architecture Details

### 1. React Hydration Overwrite Prevention (Asset Redirection)
* **Problem**: The site uses Framer-compiled React hydration. By default, pages loaded component bundle scripts directly from Framer's remote CDN (`framerusercontent.com`). During hydration, React would download these un-rebranded scripts and overwrite your local HTML changes (such as custom texts, dates, and logo links).
* **Fix**: 
  - All script loaders in the 9 HTML files are rewritten to load locally from root (`/`) rather than the remote CDN.
  - The compiled JS/MJS component modules are crawled, downloaded, and served locally from the node server.
  - **Rule**: Any future edits to headings, paragraphs, legal terms, or dates **must** be replaced in **both** the static HTML files AND the corresponding local MJS component files (`script_main.C0jqJ0fg.mjs`, `sOhK9y9-7LNSEANs-0pTNGucF6yfP181caoY--wTbT4.BBnwaOVY.mjs`, etc.) to prevent React from resetting them on load.

---

## Brand Assets & Links Memory

* **Branding Name**: Rebranded from `Tvorba` and `Nyro Silvan` to **`huaR`**.
* **Profile Card Subtitle**: Rebranded from `UX/UI Designer` to **`design agency`** (all lowercase).
* **Profile Avatar (`profile.png`)**: Replaced the default CDN photograph with your square logo brand asset (`media__1784024273843.png`, 1024x1024).
* **Contact Field Header**: Rebranded from `"Contact me"` to **`"Contact us"`** (on the profile card sidebar).
* **Profile Card CTA Button**: Rebranded from `"book a call"` to **`"connect with us"`** (on the profile card sidebar).
* **Social Profile Links**:
  - **Instagram**: [https://www.instagram.com/huar_org](https://www.instagram.com/huar_org)
  - **LinkedIn**: [https://www.linkedin.com/in/huar-org](https://www.linkedin.com/in/huar-org)
  - **Contact Email**: `huar.org@gmail.com`
  - **Redirection URL**: Points the email icon to `https://mail.google.com/mail/?view=cm&fs=1&to=huar.org@gmail.com` and the CTA button to `/contact` (same tab). The active contact page form submissions are routed to `/api/contact` locally. Nodemailer transporter is configured with `tls: { rejectUnauthorized: false }` to resolve TLS handshake/socket errors during local dev forwarding. Contact page form has a required Phone input field styled as a text/tel input. All project pages' "visit website" CTA buttons point to a local premium dark-mode `/site-down.html` error landing page.
* **Mobile View Footer**: Enabled display of `"Terms of Service"`, `"Privacy Policy"`, and `"Created by huaR"` links. Centered and stacked them elegantly on mobile viewports. Styled the copyright notice container (`.framer-13i1f67`) to be full-width and centered on mobile so it displays as a single line: `© huar.org 2025 | All Rights Reserved` on top of the footer links.
* **Blog Removal**: The blog pages, router path, and navigation links have been completely removed. The menu list now has 4 items:
  1. `01 home`
  2. `02 projects`
  3. `03 faq` (scrolls to `#faq` section container)
  4. `04 contact`

---

## Legal Pages Configuration

### 1. Privacy Policy
* **Date**: `Last Updated: Sep 6, 2025`
* **Custom Text changes**:
  - **Section 1**: Rebranded to *"Welcome to huaR. Your privacy is important to us..."*
  - **Section 7 (Termination)**: Completely removed from both HTML and MJS components.
  - **Headings**: Renumbered from 7 to 9.
  - **Rights List**: Bullet points mapped to support email `huar.org@gmail.com`.

### 2. Terms of Service
* **Date**: `Last Updated: Aug 22, 2025`
* **Custom Text changes**:
  - **Section 1 (Introduction)**: Updated to welcome users to **`huaR`** and point to **`huar.in`**.
  - **Section 2 (Services)**: Updated to list your comprehensive web design, SEO, ad campaign management, and digital marketing execution.
  - **Section 9 (Governing Law)**: Mapped to the **`laws of India`** and resolved in the **`courts of Tamil Nadu, India`**.

---

## Home Page Custom Customizations (Session memory)

### 1. Biography Statement
* **Old Text**: *"For 7+ years, I've been helping brands..."*
* **New Text**: *"For 2+ years, We've been helping brands and creators build standout websites. By combining thoughtful design with powerful no-code tools, We make the web more accessible — and more beautiful."*

### 2. Statistics Counter Block
* **Projects**: Changed count limit from `64` to **`37`**.
* **Years Experience**: Changed count limit from `10` to **`2`**.
* **Happy Clients**: Changed count limit from `80` to **`37`**.
* **Countries (formerly Awards)**: Changed count limit from `10` to **`2`**, and rebranded the text from `"Awards"` to **`"Countries"`**.

### 3. Services List Section
* **Service 1**:
  - **Heading**: Rebranded from `"UI / UX Design"` to **`"Digital Marketing"`**.
  - **Description**: *"We build data-driven growth engines that stop people from scrolling past your brand. No tech jargon, no burning cash on useless ads—just pure, measurable scaling."*
  - **Hashtags**: Changed to **`# smart SEO`**, **`# targeted ads`**, **`# growth strategy`**.
* **Service 4**:
  - **Heading**: Rebranded from `"Framer Development"` to **`"Growth Strategy"`**.
  - **Description**: *"We use scalable ad campaigns and targeted growth models that systematically turn traffic into profit. No guesswork, no wasted budget—just raw business expansion backed by actionable analytics."*
  - **Hashtags**: Changed to **`# ad strategy`**, **`# client acquisition`**, **`# meta & google ads`**.

### 4. Testimonials Section Subtitle
* **Old Text**: *"A few highlights from the amazing people I've had the chance to design for"*
* **New Text**: *"A few highlights from the amazing people, We had the chance to design for"*

### 5. First Testimonial Customization
* **Old Text**: *"It was a very cool experience! The designer understood my vision perfectly..."*
* **New Text**: *"It was a very cool experience! "huaR" understood my vision perfectly..."*
* **Date**: Changed from `04.08.2025` to **`01.06.2026`**.

### 6. Second Testimonial Customization
* **Old Text**: *"I'm really impressed with the designer's attention to detail..."*
* **New Text**: *"I'm really impressed with huaR team's attention to detail..."*
* **Date**: Changed from `01.06.2025` to **`08.12.2025`**.

### 7. Third Testimonial Customization
* **Old Text**: *"Great collaboration from start to finish! The designer listened carefully..."*
* **New Text**: *"Great collaboration from start to finish! The team listened carefully..."*
* **Date**: Changed from `12.07.2025` to **`14.11.2025`**.

### 8. First FAQ Customization
* **Old Text**: *"With Framer, websites can be built surprisingly fast..."*
* **New Text**: *"With huaR, websites can be built surprisingly fast. Depending on the scope, a site can be ready in a few days to a couple of weeks. Templates make the process even quicker — we help you to launch in hours."*
* **FAQ Intro Text**: Rebranded from `"I get asked most often"` to **`"We get asked most often"`**.

### 9. Second FAQ Customization
* **Old Question**: "Do you offer custom designs or templates?"
* **Old Answer**: "All of our templates are fully customizable and easy to adapt to your brand. Need something truly unique? Framer also allows us to create 100% custom designs from scratch."
* **New Question**: "How quickly will we see results from our campaigns?"
* **New Answer**: "Paid advertising and smart SEO move at different speeds. While targeted ads can drive high-converting traffic within days of launching, organic SEO is a long-term asset that typically takes 3 to 6 months to yield sustainable market dominance. We balance both to give you immediate wins while building permanent value."

### 10. Third FAQ Customization
* **Old Question**: "Will my website work on mobile devices?"
* **Old Answer**: "Absolutely. Every Framer site is fully responsive by default, so your website will look and perform great on mobile, tablet, and desktop."
* **New Question**: "How do you ensure our ad budget isn't wasted?"
* **New Answer**: "We skip the guesswork. Every ad strategy we launch relies on continuous conversion tracking, meticulous testing, and data-driven filtering. We treat your budget like our own, scaling down low performers instantly to protect your revenue."

### 11. Fourth FAQ Customization
* **Old Question**: "Can I update the website myself after it’s launched?"
* **Old Answer**: "Yes! That’s one of the best things about Framer. You can easily update text, images, and sections without touching code..."
* **New Question**: "Will we get reports on our growth performance?"
* **New Answer**: "Absolutely. We don't hide behind complex tech jargon or vanity metrics like likes and impressions. You will receive clean, transparent, and comprehensive updates that show exactly where your budget went, how much traffic was generated, and the direct ROI driven to your business."

### 12. Contact Section Biography Statement
* **Old Text**: *"Hi, I’m huaR, a creative designer focused on crafting clean, modern, and engaging digital experiences. I specialize in designing responsive websites and intuitive interfaces that bring ideas to life across every device."*
* **New Text**: *"huaR, a creative design agency focused on crafting clean, modern, and engaging digital experiences. We specialize in designing responsive websites, smart SEO, digital marketing, ads and intuitive interfaces that bring ideas to life across every device."*
