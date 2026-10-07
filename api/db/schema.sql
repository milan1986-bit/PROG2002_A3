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
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organisations(org_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- A3: registrations (tickets purchased) for an event.
-- There is no USER table, so a user is identified by their email address.
-- UNIQUE (event_id, email): a user can register for many events, but only once per event.
CREATE TABLE registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    tickets INT NOT NULL DEFAULT 1,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    UNIQUE (event_id, email)
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
(org_id, category_id, name, short_description, full_description, event_date, event_time, location, image_url, ticket_price, is_free, fundraising_goal, current_progress, is_suspended, latitude, longitude)
VALUES
(1, 1, 'Starlight Charity Gala', 'An elegant evening of dinner and dancing for a great cause.',
 'Join us for the Starlight Charity Gala, a black-tie evening featuring a three-course dinner, live music, and a live auction. All proceeds support scholarships for underprivileged children.',
 '2026-11-15', '18:30:00', 'Grand Harbour Hotel, Sydney', 'https://placehold.co/600x350?text=Starlight+Gala', 150.00, FALSE, 50000.00, 18500.00, FALSE, -33.868800, 151.209300),

(1, 2, 'City Fun Run 5K', 'A family-friendly 5K run/walk through the city centre.',
 'Lace up your shoes for our annual 5K Fun Run. Suitable for all ages and fitness levels. Every registration funds a school meal program.',
 '2026-10-05', '07:00:00', 'Riverside Park, Melbourne', 'https://placehold.co/600x350?text=City+Fun+Run', 25.00, FALSE, 10000.00, 4200.00, FALSE, -37.813600, 144.963100),

(1, 3, 'Art for Hope Silent Auction', 'Bid on original artworks donated by local artists.',
 'Browse and bid on a curated collection of paintings, sculptures, and photography donated by local artists. All proceeds go directly to youth mentoring programs.',
 '2026-09-28', '17:00:00', 'Community Arts Centre, Brisbane', 'https://placehold.co/600x350?text=Art+for+Hope', 0.00, TRUE, 15000.00, 6300.00, FALSE, -27.469800, 153.025100),

(1, 4, 'Voices of Change Concert', 'An evening of live music from local bands supporting mental health awareness.',
 'A night of live performances from local musicians, raising funds and awareness for youth mental health services.',
 '2026-12-02', '19:00:00', 'Open Air Theatre, Perth', 'https://placehold.co/600x350?text=Voices+of+Change', 40.00, FALSE, 20000.00, 5000.00, FALSE, -31.950500, 115.860500),

(1, 5, 'Steps for a Cause Walkathon', '10K community walkathon supporting cancer research.',
 'Walk 10K with the community to raise funds for local cancer research initiatives. Water stations and entertainment along the route.',
 '2026-10-20', '08:00:00', 'Botanic Gardens, Adelaide', 'https://placehold.co/600x350?text=Steps+for+a+Cause', 15.00, FALSE, 12000.00, 3100.00, FALSE, -34.928500, 138.600700),

(1, 1, 'Winter Wonderland Gala', 'A festive winter-themed fundraising dinner.',
 'Celebrate the season at our Winter Wonderland Gala featuring a festive dinner, raffle, and guest speakers sharing impact stories.',
 '2026-07-10', '18:00:00', 'Ivy Ballroom, Sydney', 'https://placehold.co/600x350?text=Winter+Wonderland', 120.00, FALSE, 30000.00, 30500.00, FALSE, -33.868800, 151.209300),

(1, 2, 'Spring Family Fun Run', 'A 3K family-friendly walk/run with kids activities.',
 'A shorter, family-friendly 3K route with face painting, kids activities, and a post-run picnic. Great for all ages.',
 '2026-09-05', '08:30:00', 'Centennial Park, Sydney', 'https://placehold.co/600x350?text=Spring+Fun+Run', 10.00, FALSE, 8000.00, 8000.00, FALSE, -33.868800, 151.209300),

(1, 3, 'Vintage Treasures Auction', 'Silent auction of vintage collectibles and memorabilia.',
 'Discover vintage collectibles, memorabilia, and antiques, all donated by generous community members, with proceeds supporting elderly care services.',
 '2026-11-30', '17:30:00', 'Heritage Hall, Hobart', 'https://placehold.co/600x350?text=Vintage+Treasures', 5.00, FALSE, 9000.00, 2200.00, FALSE, -42.882100, 147.327200),

(1, 4, 'Rhythms for Recovery Concert', 'A benefit concert supporting disaster relief efforts.',
 'A benefit concert featuring multiple genres, raising funds for communities affected by recent natural disasters.',
 '2026-08-15', '19:30:00', 'Riverside Amphitheatre, Brisbane', 'https://placehold.co/600x350?text=Rhythms+for+Recovery', 35.00, FALSE, 25000.00, 25000.00, TRUE, -27.469800, 153.025100);

INSERT INTO registrations (event_id, full_name, email, phone, tickets, registration_date) VALUES
(1, 'Olivia Bennett', 'olivia.bennett@example.com', '0412 345 678', 2, '2026-09-02 10:15:00'),
(1, 'Liam Nguyen', 'liam.nguyen@example.com', '0423 456 789', 4, '2026-09-18 19:42:00'),
(1, 'Charlotte Wilson', 'charlotte.wilson@example.com', '0434 567 890', 1, '2026-10-01 08:05:00'),
(2, 'Noah Patel', 'noah.patel@example.com', '0445 678 901', 3, '2026-08-20 12:30:00'),
(2, 'Olivia Bennett', 'olivia.bennett@example.com', '0412 345 678', 1, '2026-09-11 17:20:00'),
(3, 'Ava Thompson', 'ava.thompson@example.com', '0456 789 012', 2, '2026-09-01 09:00:00'),
(3, 'Jack Robinson', 'jack.robinson@example.com', '0467 890 123', 1, '2026-09-20 14:45:00'),
(5, 'Mia Anderson', 'mia.anderson@example.com', '0478 901 234', 5, '2026-09-25 11:10:00'),
(5, 'William Chen', 'william.chen@example.com', '0489 012 345', 2, '2026-10-03 16:55:00'),
(6, 'Isla Martin', 'isla.martin@example.com', '0490 123 456', 2, '2026-06-15 13:25:00'),
(7, 'Henry Walker', 'henry.walker@example.com', '0401 234 567', 3, '2026-08-28 07:50:00'),
(9, 'Grace Kelly', 'grace.kelly@example.com', '0413 579 246', 2, '2026-07-30 18:05:00');
