export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = 'https://www.goodreturns.in/petrol-price-in-bangalore.html';

    try {
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br'
      };

      const response = await fetch(url, { headers });
      const html = await response.text();

      const titleRegex = /<title>(.*?)<\/title>/;
      const match = html.match(titleRegex);

      if (match && match[1]) {
        const title = match[1];
        console.log("Title extracted:", title);

        const dateRegex = /(\d{1,2})(?:st|nd|rd|th)?\s([A-Za-z]+),\s(\d{4})/;
        const dateMatch = title.match(dateRegex);

        if (dateMatch) {
          const day = dateMatch[1];
          const month = dateMatch[2];
          const year = dateMatch[3];
          console.log(`Extracted date from title: ${day} ${month}, ${year}`);

          const priceRegex = /Rs\.\s?(\d+\.\d{2})/;
          const priceMatch = title.match(priceRegex);

          let price = "Not found";
          if (priceMatch) {
            price = priceMatch[1];
            console.log(`Extracted petrol price: ${price}`);
          }

          const responseData = {
            date: `${day} ${month}, ${year}`,
            price: price
          };

          return new Response(JSON.stringify(responseData), {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } else {
          return new Response(JSON.stringify({
            error: "Could not extract date from the title. The date format might be incorrect."
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } else {
        return new Response(JSON.stringify({
          error: "Could not fetch the title from the webpage. The title tag might be missing or malformed."
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        error: `Error fetching the page: ${error.message}`
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
} satisfies ExportedHandler<Env>;
