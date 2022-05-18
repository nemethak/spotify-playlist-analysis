import { StatisticsComponent } from "../components/statisticscomponent";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("StatisticsComponent", () => {
  const topGenres = [{id: '"rock"', occurences: 5}, 
                    {id: '"pop"', occurences: 4},
                    {id: '"modern rock"', occurences: 3},
                    {id: '"rap"', occurences: 2},
                    {id: '"indie"', occurences: 1}];
  const topArtists = [{id: '246dkjvS1zLTtiykXe5h60', name: 'Post Malone', occurences: 8},
                      {id: '53XhwfbYqKCa1cC15pYq2q', name: 'Imagine Dragons', occurences: 4},
                      {id: '4LJfnGBABdrlnlVpiM2qvW', name: 'FEiN', occurences: 4},
                      {id: '3w4VAlllkAWI6m0AV0Gn6a', name: 'Hurts', occurences: 4},
                      {id: '6CwfuxIqcltXDGjfZsMd9A', name: 'MARINA', occurences: 3}];
  const duration = "1:00:00";

  it("renders the main cards", () => {
    render(<StatisticsComponent topArtists={topArtists} topGenres={topGenres} duration={duration}/>);
      expect(screen.getByTestId("audio-features-card")).toBeInTheDocument();
      expect(screen.getByTestId("row")).toBeInTheDocument();
      expect(screen.getByTestId("top-genres-card")).toBeInTheDocument();
      expect(screen.getByTestId("top-artists-card")).toBeInTheDocument();
  });

  it("renders the correct duration", () => {
    render(<StatisticsComponent topArtists={topArtists} topGenres={topGenres} duration={duration}/>);
    expect(screen.getByTestId("duration")).toBeInTheDocument();
    expect(screen.getByText(`Length of playlist: ${duration}`)).toBeInTheDocument();
  });

  it("renders the correct top genres", () => {
    render(<StatisticsComponent topArtists={topArtists} topGenres={topGenres} duration={duration}/>);
    topGenres.forEach(genre => {
      expect(screen.getByTestId(genre.id)).toBeInTheDocument();
    });
  });
  
  it("renders the correct top artists", () => {
    render(<StatisticsComponent topArtists={topArtists} topGenres={topGenres} duration={duration}/>);
    topArtists.forEach(artist => {
      expect(screen.getByTestId(artist.id)).toBeInTheDocument();
    });
  });
});
