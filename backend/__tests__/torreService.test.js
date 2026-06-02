jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

const axios = require('axios');
const {
  clearTorreCache,
  getGenome,
  searchEntities,
  searchJobs,
} = require('../src/services/torreService');

describe('torreService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearTorreCache();
  });

  it('filters opportunity results locally and applies requested pagination', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        total: 3,
        results: [
          {
            id: 'job1',
            objective: 'Frontend Developer',
            tagline: 'Build React interfaces',
            organizations: [{ name: 'Acme' }],
            locations: ['Remote'],
            skills: [{ name: 'React' }],
          },
          {
            id: 'job2',
            objective: 'Sales Manager',
            tagline: 'Lead enterprise deals',
            organizations: [{ name: 'Growth Co' }],
            locations: ['Bogota'],
            skills: [{ name: 'Negotiation' }],
          },
          {
            id: 'job3',
            objective: 'Backend Engineer',
            tagline: 'Develop Node.js APIs',
            organizations: [{ name: 'Platform Labs' }],
            locations: ['Remote'],
            skills: [{ name: 'Node.js' }],
          },
          {
            id: 'job1',
            objective: 'Frontend Developer',
            tagline: 'Build React interfaces',
            organizations: [{ name: 'Acme' }],
            locations: ['Remote'],
            skills: [{ name: 'React' }],
          },
        ],
      },
    });

    const result = await searchJobs({ text: 'develop' }, 0, 1);

    expect(axios.post).toHaveBeenCalledWith(
      'https://search.torre.co/opportunities/_search/?offset=0&size=20&aggregate=false',
      {},
      expect.any(Object),
    );
    expect(result.results).toEqual([
      expect.objectContaining({ id: 'job1' }),
    ]);
    expect(result.total).toBe(2);
    expect(result.upstreamTotal).toBe(3);
  });

  it('filters people results by headline and skills', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        results: [
          {
            username: 'ada',
            name: 'Ada Lovelace',
            professionalHeadline: 'Software developer',
            skills: [{ name: 'Mathematics' }],
          },
          {
            username: 'grace',
            name: 'Grace Hopper',
            professionalHeadline: 'Computer scientist',
            skills: [{ name: 'Compiler design' }],
          },
        ],
      },
    });

    const result = await searchEntities({ text: 'developer' });

    expect(axios.post).toHaveBeenCalledWith(
      'https://search.torre.co/people/_search/?offset=0&size=20&aggregate=false',
      {},
      expect.any(Object),
    );
    expect(result).toEqual([
      expect.objectContaining({ username: 'ada' }),
    ]);
  });

  it('reuses cached opportunity pages for repeated job searches', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        total: 1,
        results: [
          {
            id: 'job1',
            objective: 'Frontend Developer',
            tagline: 'Build React interfaces',
            organizations: [{ name: 'Acme' }],
            locations: ['Remote'],
            skills: [{ name: 'React' }],
          },
        ],
      },
    });

    const firstResult = await searchJobs({ text: 'developer' }, 0, 1);
    const secondResult = await searchJobs({ text: 'frontend' }, 0, 1);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(firstResult.results).toEqual([expect.objectContaining({ id: 'job1' })]);
    expect(secondResult.results).toEqual([expect.objectContaining({ id: 'job1' })]);
  });

  it('reuses cached genome responses by username', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        person: {
          username: 'alice',
          name: 'Alice Candidate',
        },
      },
    });

    const firstResult = await getGenome('Alice');
    const secondResult = await getGenome('alice');

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(firstResult).toEqual(secondResult);
  });
});
