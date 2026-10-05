DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db;
USE charityevents_db;

CREATE TABLE organisations (
    org_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    mission_statement TEXT,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(30),
    logo_url VARCHAR(255)
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    short_description VARCHAR(255),
    full_description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(150) NOT NULL,
    image_url VARCHAR(255),
    ticket_price DECIMAL(8,2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT FALSE,
    fundraising_goal DECIMAL(10,2) DEFAULT 0.00,
    current_progress DECIMAL(10,2) DEFAULT 0.00,
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organisations(org_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

INSERT INTO organisations (name, mission_statement, contact_email, contact_phone, logo_url) VALUES
('Bright Futures Foundation', 'Empowering underprivileged children through education and community support.', 'contact@brightfutures.org', '02 5550 1234', 'https://placehold.co/120x120?text=BFF');

INSERT INTO categories (name) VALUES
('Gala Dinner'),
('Fun Run'),
('Silent Auction'),
('Concert'),
('Walkathon');

INSERT INTO events
(org_id, category_id, name, short_description, full_description, event_date, event_time, location, image_url, ticket_price, is_free, fundraising_goal, current_progress, is_suspended)
VALUES
(1, 1, 'Starlight Charity Gala', 'An elegant evening of dinner and dancing for a great cause.',
 'Join us for the Starlight Charity Gala, a black-tie evening featuring a three-course dinner, live music, and a live auction. All proceeds support scholarships for underprivileged children.',
 '2026-11-15', '18:30:00', 'Grand Harbour Hotel, Sydney', 'https://placehold.co/600x350?text=Starlight+Gala', 150.00, FALSE, 50000.00, 18500.00, FALSE),

(1, 2, 'City Fun Run 5K', 'A family-friendly 5K run/walk through the city centre.',
 'Lace up your shoes for our annual 5K Fun Run. Suitable for all ages and fitness levels. Every registration funds a school meal program.',
 '2026-10-05', '07:00:00', 'Riverside Park, Melbourne', 'https://placehold.co/600x350?text=City+Fun+Run', 25.00, FALSE, 10000.00, 4200.00, FALSE),

(1, 3, 'Art for Hope Silent Auction', 'Bid on original artworks donated by local artists.',
 'Browse and bid on a curated collection of paintings, sculptures, and photography donated by local artists. All proceeds go directly to youth mentoring programs.',
 '2026-09-28', '17:00:00', 'Community Arts Centre, Brisbane', 'https://placehold.co/600x350?text=Art+for+Hope', 0.00, TRUE, 15000.00, 6300.00, FALSE),

(1, 4, 'Voices of Change Concert', 'An evening of live music from local bands supporting mental health awareness.',
 'A night of live performances from local musicians, raising funds and awareness for youth mental health services.',
 '2026-12-02', '19:00:00', 'Open Air Theatre, Perth', 'https://placehold.co/600x350?text=Voices+of+Change', 40.00, FALSE, 20000.00, 5000.00, FALSE),

(1, 5, 'Steps for a Cause Walkathon', '10K community walkathon supporting cancer research.',
 'Walk 10K with the community to raise funds for local cancer research initiatives. Water stations and entertainment along the route.',
 '2026-10-20', '08:00:00', 'Botanic Gardens, Adelaide', 'https://placehold.co/600x350?text=Steps+for+a+Cause', 15.00, FALSE, 12000.00, 3100.00, FALSE),

(1, 1, 'Winter Wonderland Gala', 'A festive winter-themed fundraising dinner.',
 'Celebrate the season at our Winter Wonderland Gala featuring a festive dinner, raffle, and guest speakers sharing impact stories.',
 '2026-07-10', '18:00:00', 'Ivy Ballroom, Sydney', 'https://placehold.co/600x350?text=Winter+Wonderland', 120.00, FALSE, 30000.00, 30500.00, FALSE),

(1, 2, 'Spring Family Fun Run', 'A 3K family-friendly walk/run with kids activities.',
 'A shorter, family-friendly 3K route with face painting, kids activities, and a post-run picnic. Great for all ages.',
 '2026-09-05', '08:30:00', 'Centennial Park, Sydney', 'https://placehold.co/600x350?text=Spring+Fun+Run', 10.00, FALSE, 8000.00, 8000.00, FALSE),

(1, 3, 'Vintage Treasures Auction', 'Silent auction of vintage collectibles and memorabilia.',
 'Discover vintage collectibles, memorabilia, and antiques, all donated by generous community members, with proceeds supporting elderly care services.',
 '2026-11-30', '17:30:00', 'Heritage Hall, Hobart', 'https://placehold.co/600x350?text=Vintage+Treasures', 5.00, FALSE, 9000.00, 2200.00, FALSE),

(1, 4, 'Rhythms for Recovery Concert', 'A benefit concert supporting disaster relief efforts.',
 'A benefit concert featuring multiple genres, raising funds for communities affected by recent natural disasters.',
 '2026-08-15', '19:30:00', 'Riverside Amphitheatre, Brisbane', 'https://placehold.co/600x350?text=Rhythms+for+Recovery', 35.00, FALSE, 25000.00, 25000.00, TRUE);
