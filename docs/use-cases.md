# Use Case Specification: Cinema Booking System

---

## 1. Register
* **Actor:** User
* **Preconditions:** User is not authenticated and has navigated to the Registration page.
* **Main Scenario:**
    1. User selects the "Register" option.
    2. User enters required details (email, password, name).
    3. System validates the input data.
    4. System creates a new account
* **Alternative Scenarios / Errors:**
    * **Invalid data format:** System highlights specific fields and asks for correction.
    * **Login already exists:** System notifies the user and asks to log in or use a different email.

---

## 2. LogIn
* **Actor:** User
* **Preconditions:** User must have an existing account.
* **Main Scenario:**
    1. User enters credentials (login and password).
    2. System verifies credentials against the database.
    3. System grants access-token.
* **Alternative Scenarios / Errors:**
    * **Wrong Credentials:** System displays an error message: "Login or password is wrong"

---

## 3. View Movies
* **Actor:** User
* **Preconditions:** None.
* **Main Scenario:**
    1. User accesses the movie catalog.
    2. System fetches and displays a list of currently showing or upcoming movies.
    3. User browses through the titles.
* **Alternative Scenarios / Errors:**
    * -

---

## 4. Select Movie
* **Actor:** User
* **Preconditions:** User is browsing the movie list.
* **Main Scenario:**
    1. User clicks on a specific movie poster or title.
    2. System displays movie details (description, duration, available sessions).
* **Alternative Scenarios / Errors:**
    * **Movie no longer available/not found:** System updates the view and notifies the user that the movie was removed.

---

## 5. Select Session
* **Actor:** User
* **Preconditions:** A movie has been selected.
* **Main Scenario:**
    1. User views the list of available dates and times for the selected movie.
    2. User selects a specific time slot.
    3. System prepares the hall layout for the selected session.
* **Alternative Scenarios / Errors:**
    * **Session Sold Out:** System marks the session as "Sold Out" and prevents selection.
    * **Session Not Found:** Incorrect input data received during selection.

---

## 6. Book Seats
* **Actor:** User
* **Preconditions:** A session has been selected
* **Main Scenario:**
    1. System displays the "Model grid for hall" showing available and taken seats.
    2. User selects one or more available seats.
    3. System temporarily reserves the seats for a specific time window.
    4. System actives discounts for payment if conditions is completed
* **Alternative Scenarios / Errors:**
    * **Booking time is ended:** If the start to session is less than 10 minutes, the system returns error
    * **Seat taken during selection:** If another user books the seat simultaneously, the system reserved the seat and displays an error.

---

## 7. Pay for Order
* **Actor:** User
* **Preconditions:** Seats are selected and temporarily reserved.
* **Main Scenario:**
    1. User chooses a payment method.
    2. User enters payment details and confirms the transaction.
    3. System processes payment and confirms the booking.
* **Alternative Scenarios / Errors:**
    * **Payment Declined:** System notifies the user and allows them to try a different card.
    * **Session Timeout:** If the payment takes too long, the reservation expires, and seats are released.

---

## 8. LogIn via AdminForm
* **Actor:** Admin
* **Preconditions:** Admin has access to the administrative URL/form.
* **Main Scenario:**
    1. Admin enters administrative credentials.
    2. System verifies admin rights.
    3. System redirects to the Admin Dashboard.
* **Alternative Scenarios / Errors:**
    * **Access Denied:** System denies entry if credentials do not match administrative records.

---

## 9. Create a Movie
* **Actor:** Admin
* **Preconditions:** Admin is logged in.
* **Main Scenario:**
    1. Admin enters movie details (title, genre, description, duration).
    2. Admin saves the record.
    3. System adds the movie to the database.
* **Alternative Scenarios / Errors:**
    * **Missing Information:** System prevents saving if mandatory fields are incorrect.

---

## 10. Update a Movie
* **Actor:** Admin
* **Preconditions:** Admin is logged in, Movie is created
* **Main Scenario:**
    1. Admin enters movie details (title, genre, description, duration).
    2. Admin saves the record.
    3. System updates/deletes the movie info in the database.
* **Alternative Scenarios / Errors:**
    * **Missing Information:** System prevents saving if mandatory fields are incorrect.
    * **Movie is in rent** System prevents saving if movie is streaming now.

---

## 11. Create Sessions
* **Actor:** Admin
* **Preconditions:** At least one movie exists; Admin is logged in.
* **Main Scenario:**
    1. Admin selects a movie.
    2. Admin assigns a date, time, and specific hall.
    3. System generates the session.
* **Alternative Scenarios / Errors:**
    * **Schedule Conflict:** System warns if the hall is already occupied at the selected time.

---

## 12. Update Sessions
* **Actor:** Admin
* **Preconditions:** At least one movie exists; Admin is logged in.
* **Main Scenario:**
    1. Admin selects a session.
    2. Admin assigns a date, time, and specific hall.
    3. System updates/deletes the session.
* **Alternative Scenarios / Errors:**
    * **Schedule Conflict:** System warns if the hall is already occupied at the selected time.
    * **Session is in rent** System prevents saving if session is streaming now.

---

## 13. Model Grid for Hall
* **Actor:** Admin
* **Preconditions:** Admin is creating or editing a session.
* **Main Scenario:**
    1. Admin defines the configuration of the hall (rows and seats).
    2. Admin sets hall info.
    3. System saves the hall configuration.
* **Alternative Scenarios / Errors:**
    * **Invalid Dimensions:** System prevents saving if the layout is mathematically impossible for the selected hall.

## 14. Update Grid for Hall
* **Actor:** Admin
* **Preconditions:** Admin is creating or editing a session.
* **Main Scenario:**
    1. Admin defines the configuration of the hall (rows and seats).
    2. Admin sets hall info.
    3. System updates/delete the hall configuration.
* **Alternative Scenarios / Errors:**
    * **Sessions are active:** System prevents saving if there are unfinished sessions in hall