# Menka Kumari Rajak — Portfolio Website

A personal portfolio website built with plain HTML, CSS, and JavaScript. No frameworks or build tools required — just open in a browser.

---

## Project Structure

```
portfolio/
├── index.html      # Main HTML file (all sections)
├── style.css       # All styles and responsive design
├── script.js       # Navbar toggle + skill bar animation
├── menk1.jpeg      # Profile photo
└── README.md       # Project documentation
```

---

## Sections

| Section   | Description                                                  |
|-----------|--------------------------------------------------------------|
| Navbar    | Fixed top navigation with smooth scroll links and hamburger menu on mobile |
| Hero      | Name, title, short bio, profile photo, and CTA buttons       |
| About     | Personal introduction with 3 info cards (Developer, Learner, Problem Solver) |
| Skills    | 8 skill cards with animated progress bars                    |
| Projects  | "Coming Soon" placeholder with floating rocket animation     |
| Contact   | Cards for Phone, Email, GitHub, LinkedIn                     |
| Footer    | Copyright line                                               |

---

## Color Palette

| Variable    | Hex       | Usage                          |
|-------------|-----------|--------------------------------|
| `--dark`    | `#202940` | Background, navbar             |
| `--brown`   | `#4B4038` | Section backgrounds, accents   |
| `--mid`     | `#9A8678` | Body text, descriptions        |
| `--light`   | `#CAAA98` | Highlights, icons, borders     |
| `--white`   | `#f5f0ec` | Headings, logo                 |
| `--text`    | `#e8ddd6` | General text                   |

---

## External Libraries

| Library         | Version | Purpose              | CDN |
|-----------------|---------|----------------------|-----|
| Google Fonts (Poppins) | —  | Typography      | Yes |
| Font Awesome    | 6.5.0   | Icons                | Yes |

No npm packages or build steps needed.

---

## Skills Listed

| Skill              | Progress |
|--------------------|----------|
| HTML & CSS         | 85%      |
| JavaScript         | 75%      |
| React.js           | 70%      |
| Node.js            | 65%      |
| Project Management | 65%      |
| MongoDB            | 60%      |
| Python             | 60%      |
| SQL                | 55%      |

---

## JavaScript Features (`script.js`)

### 1. Hamburger Menu
Toggles the `.open` class on `.nav-links` when the hamburger icon is clicked on mobile. Clicking any nav link also closes the menu.

```js
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
```

### 2. Skill Bar Animation
Uses the `IntersectionObserver` API to animate skill bars only when they scroll into view. Each `.skill-fill` element has a `data-width` attribute that sets the final width.

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width;
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
```

---

## Responsive Design

- Breakpoint: `768px` and below
- On mobile:
  - Navbar links hide and are toggled via hamburger icon
  - Hero section stacks vertically (photo on top, text below)
  - Profile photo shrinks from `220px` to `160px`
  - Buttons center-align
- All grids use `auto-fit` with `minmax()` so they reflow naturally on any screen size

---

## How to Run

1. Make sure all files are in the same folder:
   ```
   portfolio/
   ├── index.html
   ├── style.css
   ├── script.js
   └── menk1.jpeg
   ```
2. Open `index.html` in any modern browser — no server needed.

---

## Future Updates

- [ ] Add LinkedIn URL in the contact section
- [ ] Replace "Coming Soon" with real project cards
- [ ] Add a contact form with email functionality
- [ ] Deploy to GitHub Pages or Netlify

---

## Author

**Menka Kumari Rajak**
Full Stack Web Developer (MERN Stack)
- Email: kumarimenka163@gmail.com
- GitHub: [github.com/menka-dev](http://github.com/menka-dev)
