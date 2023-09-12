'use strict'

// database operations.
// Async operations can always fail, so these are all wrapped in try-catch blocks
// so that they will always return something
// that the calling function can use. 

// Export functions that will be used in other files.
module.exports = {
  testDB: testDB, //adds test entries to the DB
  post_video: post_video,
  get_video: get_video,
  get_most_recent: get_most_recent,
  delete_video: delete_video,
  delete_prefs: delete_prefs,
  get_all: get_all,
  delete_all: delete_all,
  get_count: get_count,
}

// using a Promises-wrapped version of sqlite3
const db = require('./sqlWrap');

// SQL commands for VideoTable
const insertVideo = "INSERT INTO VideoTable (url, nickname, userid, flag) values (?,?,?,TRUE)"
const getVideo = "SELECT * FROM VideoTable WHERE nickname = ?";
// const getMostRecent = "SELECT * FROM VideoTable WHERE flag = TRUE";
const getMostRecent = "SELECT * FROM VideoTable ORDER BY rowIdNum DESC LIMIT 1"; //temporary sol
const deleteVideo = "DELETE FROM VideoTable WHERE nickname = ?";
const getAllVideos = "SELECT * FROM VideoTable";
const deleteAllPrefs = "DELETE FROM PrefTable";
const getCount = "SELECT COUNT(rowIdNum) FROM VideoTable";
const setAllFlagFalse = "UPDATE VideoTable SET flag = FALSE"; //for post_video (inserting new)
const getLast = "SELECT * FROM VideoTable ORDER BY rowIdNum DESC LIMIT 1";

// only the most recent video flag = 1
// set flag 1 to 0 when adding new vid

// Testing function loads some data into DB. 
// Is called when app starts up to put fake 
// data into db for testing purposes.
// Can be removed in "production". 
async function testDB() {
  console.log("in testDB")
  // all DB commands are called using await
  // empty out database - probably you don't want to do this in your program
  await db.deleteEverything();
  let dbData = [
    {
      "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
      "nickname": "1Cat vs Fish",
      "userid": "ProfAmenta"
    },
    {
      "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
      "nickname": "2Cat vs Fish",
      "userid": "ProfAmenta"
    },
    {
      "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
      "nickname": "3Cat vs Fish",
      "userid": "ProfAmenta"
    },
    {
      "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
      "nickname": "4Cat vs Fish",
      "userid": "ProfAmenta"
    },
    {
      "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
      "nickname": "5Cat vs Fish",
      "userid": "ProfAmenta"
    },
    {
      "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
      "nickname": "6Cat vs Fish",
      "userid": "ProfAmenta"
    },
    {
      "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
      "nickname": "7Cat vs Fish",
      "userid": "ProfAmenta"
    },
    {
      "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
      "nickname": "8Cat vs Fish",
      "userid": "ProfAmenta"
    },
    {
      "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
      "nickname": "9Cat vs Fish",
      "userid": "ProfAmenta"
    },
    {
      "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
      "nickname": "10Cat vs Fish",
      "userid": "ProfAmenta"
    }
  ]
  for (const entry of dbData) {
    await post_video(entry.url, entry.nickname, entry.userid);
  }
  let obj = {
    "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
    "nickname": "Cat vs Fish",
    "userid": "ProfAmenta"
  };

  await delete_video("11Cat vs Fish");

  await post_video(obj.url, obj.nickname, obj.userid);

  // get multiple items as a list
  let result = await get_all();
  console.log("sample multiple db result", result);
  // result = await get_most_recent();
  // console.log("Most recent", result);


  /* test some functions:
  // some examples of getting data out of database
  // look at an item we just inserted
  let result = await get_video("Dog vs Dog");
  console.log("sample single db result",result);

  // get multiple items as a list
  result = await get_all();
  console.log("sample multiple db result",result);

  let count = await get_count();
  console.log(count);
  
  await delete_video("Car vs Fish");
  
  result = await get_all();
  console.log("after deleting car vs fish",result);

  count = await get_count();
  console.log(count)
  */
}

//Insert video into the database
async function post_video(url, nickname, userid) {
  let count = await get_count();
  if (count >= 0 && count < 8) {
    await set_all_flag_false();
  } else {
    return;
  }
  try {
    console.log("Post '" + nickname + "'")
    await db.run(insertVideo, [url, nickname, userid]);

  } catch (error) {
    console.log("error", error)
  }
}

//Search database for video by nickname and return it
async function get_video(nickname) {
  try {
    let result = await db.get(getVideo, [nickname]);
    return (result != null) ? result : null;
  }
  catch (error) {
    console.log(error);
    return null;
  }
}

// Search database for most recent video (flag is 1)
async function get_most_recent() {
  try {
    let result = await db.all(getMostRecent, []);
    return (result != null) ? result : null;
  }
  catch (error) {
    console.log(error);
    return null;
  }
}


// Delete video by nickname from database
async function delete_video(nickname) {
  try {
    await db.run(deleteVideo, [nickname]);
  }
  catch (error) {
    console.log(error);
  }
}

// Delete all prefs
async function delete_prefs() {
  try {
    await db.run(deleteAllPrefs);
    await db.run("vacuum");
  }
  catch (error) {
    console.log(error);
  }
}

// Get number of videos in database
async function get_count() {
  try {
    let result = await db.get(getCount, []);
    result = JSON.stringify(result);
    result = parseInt(result.substring(result.indexOf(":") + 1, result.length));
    // console.log("Count is " + result);
    return (result != null) ? result : null;
  }
  catch (error) {
    console.log(error);
    return null;
  }
}

// Dumps whole table; useful for debugging
async function get_all() {
  try {
    let results = await db.all("select * from VideoTable", []);
    return results;
  }
  catch (error) {
    console.log(error);
    return [];
  }
}

// Deletes all entries in database
async function delete_all() {
  try {
    await db.deleteEverything();
  }
  catch (error) {
    console.log(error);
  }
}

//below are functions mainly used by other functions

async function set_all_flag_false() {
  try {
    await db.run(setAllFlagFalse, []);
    console.log("Flag changed");
  } catch (error) {
    console.log("error", error)
  }
}