// Firebase Imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,signOut,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, getDocs, setDoc, } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaWsuVR8bqjyNROV6UH8jjMe9kBn3smsk",
  authDomain: "natalcare-3c799.firebaseapp.com",
  databaseURL: "https://natalcare-3c799-default-rtdb.firebaseio.com",
  projectId: "natalcare-3c799",
  storageBucket: "natalcare-3c799.appspot.com",
  messagingSenderId: "362770937542",
  appId: "1:362770937542:web:afa58bf6c7fd8fca8349c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to Fetch and Display Data
async function displayData() {
    const colRef = collection(db, 'Courses');
    try {
        const querySnapshot = await getDocs(colRef);
        const container = document.getElementById('data-container');
        container.innerHTML = ''; // Clear existing content

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const div = document.createElement('div');
            div.className = 'data-item';

            div.innerHTML = `
                <div class="card">
                    <img src="${data.Image}" alt="${data.Title}">
                    <div class="card-content">
                        <h2>${data.Title || 'No Title'}</h2>
                        <div class="tags">
                             <p>${data.HealthTags || 'No Description'}</p>
                             <p>Benefits: ${data.Benefits || 'No Benefits'}</p>
                        </div>
                        <button class="watch-preview" data-video-url="${data.Video}">Watch Preview Video</button>
                        <button class="join-program btn bg-warning" data-category-id="${doc.id}">Join Program</button>
                    </div>
                </div>
            `;

            container.appendChild(div);
        });

        // Add event listeners for watch preview buttons
        document.querySelectorAll('.watch-preview').forEach(button => {
            button.addEventListener('click', () => {
                const videoUrl = button.getAttribute('data-video-url');
                if (videoUrl) {
                    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
                    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    
                    const videoContainer = document.getElementById('videoContainer');
                    videoContainer.innerHTML = `<iframe width="360" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
                    
                    const modal = document.getElementById('videoModal');
                    modal.style.display = 'block';
                }
            });
        });

        // Close the modal
        document.querySelector('.close').addEventListener('click', () => {
            const modal = document.getElementById('videoModal');
            modal.style.display = 'none';
            document.getElementById('videoContainer').innerHTML = '';
        });

        window.addEventListener('click', event => {
            const modal = document.getElementById('videoModal');
            if (event.target === modal) {
                modal.style.display = 'none';
                document.getElementById('videoContainer').innerHTML = '';
            }
        });

        // Add event listeners for join-program buttons
        document.querySelectorAll('.join-program').forEach(button => {
            button.addEventListener('click', () => {
                const categoryId = button.getAttribute('data-category-id');
                if (categoryId) {
                    const programPageUrl = `programpage.html?page=${categoryId}`;
                    window.location.href = programPageUrl;
                }
            });
        });

    } catch (error) {
        console.error('Error getting documents: ', error);
    }
}

// Call the function to display data
displayData();

//
// Function to handle program page details
document.addEventListener('DOMContentLoaded', async () => {
    // Function to get query parameter from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the category ID from the URL parameter 'page'
    const categoryId = getQueryParam('page');

    if (categoryId) {
        console.log('Category ID:', categoryId);

        // Reference to the Firestore document
        const docRef = doc(db, 'Courses', categoryId);

        try {
            // Fetch the document
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Display category image
                const categoryImage = document.getElementById('categoryImage');
                categoryImage.src = data.Image || ''; // Assuming the API returns an image URL

                // Display category description
                const description = document.getElementById('description');
                description.textContent = data.Description || ''; // Assuming the API returns a description
                 // Display category Title
                 const title = document.getElementById('collectionName');
                 description.textContent = data.Title || ''; // Assuming the API returns a description
 
                // Function to extract YouTube video ID from URL
                const getYouTubeVideoId = (url) => {
                    const urlParts = new URL(url);
                    const videoId = urlParts.searchParams.get('v') || urlParts.pathname.split('/').pop();
                    return videoId;
                };

                // Display sub-collections
                const subCategoriesContainer = document.getElementById('subCategories');
                if (subCategoriesContainer) {
                    // Replace 'Module1-Introduction' with the actual subcollection name
                    const subCollectionRef = collection(docRef, 'Module1-Introduction');
                    const subCollectionSnapshot = await getDocs(subCollectionRef);

                    // Iterate through each document in the subcollection
                    subCollectionSnapshot.forEach((subDoc) => {
                        const subData = subDoc.data();
                        const videoId = getYouTubeVideoId(subData.Lesson);
                        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

                        // Create a div element for the subcategory
                        const subCategoryDiv = document.createElement('div');
                        subCategoryDiv.innerHTML = `
                            <div class="card1">
                                <iframe width="360" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
                                <div class="card1-content">
                                    <h6 class="comic-neue-regular">${subData.Title}</h6>
                                    <p class="comic-neue-light subdes">${subData.Description}</p>
                                </div>
                            </div>
                        `;
                        
                        // Append the subcategory div to the container
                        subCategoriesContainer.appendChild(subCategoryDiv);
                    });
                }

            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching category details:', error);
        }
    }
});


// Close the modal when the user clicks on <span> (x)


// Close the modal when the user clicks anywhere outside of the modal

const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const authButton = document.getElementById('auth-button');
const toggleText = document.getElementById('toggle-text');
const confirmPasswordContainer = document.getElementById('confirm-password-container');
const authError = document.getElementById('auth-error');
const authSuccess = document.getElementById('auth-success');

let isSignUp = false;

const toggleAuthMode = () => {
    isSignUp = !isSignUp;
    authTitle.textContent = isSignUp ? 'Sign Up' : 'Sign In';
    authButton.textContent = isSignUp ? 'Sign Up' : 'Sign In';
    confirmPasswordContainer.style.display = isSignUp ? 'block' : 'none';
    toggleText.innerHTML = isSignUp
        ? `Already have an account? <button type="button" id="toggle-btn" class="btn btn-link">Sign In</button>`
        : `Don't have an account? <button type="button" id="toggle-btn" class="btn btn-link">Sign Up</button>`;
    document.getElementById('toggle-btn').addEventListener('click', toggleAuthMode);
};

document.getElementById('toggle-btn').addEventListener('click', toggleAuthMode);

authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = isSignUp ? document.getElementById('confirmPassword').value : '';

    if (isSignUp && password !== confirmPassword) {
        authError.textContent = 'Passwords do not match.';
        authError.style.display = 'block';
        return;
    }

    authError.style.display = 'none';
    authSuccess.style.display = 'none';

    try {
        if (isSignUp) {
            // Sign up the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create a Firestore document for the user
            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                userId: user.uid,
                name: "",
                dob: "",
                contact: "",
                address: "",
                emergencyContact: "",
                emergencyContactName:"",
                gender: "Female",
                insurance: "",
               medicalHistory:"",
               medications:"",
               allergies:"",
               healthReview:"",
        

            });

            authSuccess.textContent = 'Account created successfully.';
            authSuccess.style.display = 'block';
            console.log('Sign-up successful, redirecting to account.html');
            setTimeout(() => {
                window.location.href = 'programs.html'; 
            }, 300);
        } else {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            authSuccess.textContent = 'Signed in successfully.';
            authSuccess.style.display = 'block';
            console.log('Sign-in successful, redirecting to account.html');
            setTimeout(() => {
                window.location.href = 'programs.html'; 
            }, 300);
        }
    } catch (error) {
        authError.textContent = `Error: ${error.message}`;
        authError.style.display = 'block';
    }
});


// Add JavaScript for animations or other interactive features
// Handle user authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            
            douument.getElementById('profile-name').textContent=userData.name||"Please fill in your name";
            document.getElementById('profile-dob').textContent =userData.dob || 'Not provided';
            document.getElementById('profile-contact').textContent = userData.contact || 'Not provided';
            document.getElementById('profile-address').textContent = userData.address || 'Not provided';
            document.getElementById('emergency-contact-name').textContent = userData.emergencyContactName || 'Not provided';
            document.getElementById('emergency-contact').textContent = userData.emergencyContact || 'Not provided';
            document.getElementById('medical-history').textContent = userData.medicalHistory || 'Not provided';
            document.getElementById('medications').textContent = userData.medications || 'Not provided';
            document.getElementById('allergies').textContent = userData.allergies || 'Not provided';
            document.getElementById('health-review').textContent = userData.healthReview || 'Not provided';
        } else {
            console.log('No such document!');
        }
    } else {
        console.log('No user is signed in.');
        // Optionally, redirect to the login page
        
    }
});

// Log out user
function logOutUser() {
    signOut(auth).then(() => {
        console.log('User signed out successfully.');
        alert('You are signed out');
        // Redirect to the login page or homepage
        window.location.href = 'index.html'; // Adjust this URL to your login page or homepage
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

// Attach event listener to the logout button
document.getElementById('logoutButton').addEventListener('click', logOutUser);



//form filling 
// Event listener for the update button

