import { useState, useEffect } from "react";
import axios from "axios";

import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.querySelector(".layout").scrollTop =
      document.querySelector(".layout").scrollHeight;
  }, [posts]);

  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      "https://chatgpt-ai-app-od21.onrender.com",
      // "http://localhost:5173",
      { input },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.pop();
          if (lastItem.type !== "bot") {
            prevState.push({
              type: "bot",
              post: text.charAt(index - 1),
            });
          } else {
            prevState.push({
              type: "bot",
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  const onSubmit = () => {
    if (input.trim() === "") return;
    updatePosts(input);
    updatePosts("loading...", false, true);
    setInput("");
    fetchBotResponse()
      .then((res) => {
        console.log(res.bot.trim());
        updatePosts(res.bot.trim(), true);
      })
      .catch((err) => {
        setError(`Sorry! ${err.message} you are trying to run on http`);
      });
  };

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        return [
          ...prevState,
          {
            type: isLoading ? "loading" : "user",
            post,
          },
        ];
      });
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      onSubmit();
    }
  };

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {error && <h2> {error}</h2>}
          {posts.map((post, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                post.type === "bot" || post.type === "loading" ? "bot" : ""
              }`}
            >
              <div className="avatar">
                <img
                  alt=""
                  src={
                    post.type === "bot" || post.type === "loading" ? bot : user
                  }
                />
              </div>
              {post.type === "loading" ? (
                <div className="loader">
                  <img src={loadingIcon} alt="Loading" />
                </div>
              ) : (
                <div className="post">{post.post}</div>
              )}
            </div>
          ))}
        </div>
      </section>
      <footer>
        <input
          className="composebar"
          value={input}
          autoFocus
          type="text"
          placeholder="Ask anything! Make sure you are running on Https..."
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="Sending " />
        </div>
      </footer>
    </main>
  );
}

export default App;

// To use this application, simply replace the placeholder with your own API key, which you can obtain for free from openai.com. Please ensure that you are running the application on an HTTPS-enabled environment, as it may not function properly on localhost otherwise.

// For deployment, you have a variety of options available:
// Git: Use Git to version control your code and easily deploy it to various platforms.
// AWS (Amazon Web Services): Leverage AWS services like EC2, Elastic Beanstalk, or Lambda for hosting and deploying your application.
// Docker: Containerize your application using Docker and deploy it to any platform that supports Docker containers.
// Kubernetes: Utilize Kubernetes for orchestrating and managing containerized applications across different environments.
// Microsoft Azure: Deploy your application on Azure using its robust infrastructure and services.
// Google Cloud Platform: Leverage Google Cloud Platform to host and deploy your application with scalability and reliability.
// Netlify: Easily deploy your static frontend and serverless functions using Netlify's hosting and deployment capabilities.
// Heroku: Deploy your application on Heroku's cloud platform, which provides a straightforward and user-friendly deployment process.
// Vercel: Host and deploy your frontend React application with ease using Vercel's serverless platform.
// Choose the deployment option that best suits your needs and preferences to make your MERN application accessible to users.
