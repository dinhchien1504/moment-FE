const HomePage = async () => {

  const res = await fetch("https://moment-be-ilvb.onrender.com/api/account", {
    method: "GET",
    headers: {
      'Content-Type': 'text/plain'
    },
  })
  const data = await res.json();

  console.log(data)

  return (<>
     {data[1]?.status ? "fetch api sucess" : "fetch api error"}
  </>)
}

export default HomePage