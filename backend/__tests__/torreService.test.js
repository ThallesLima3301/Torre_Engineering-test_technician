jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

const axios = require('axios');
const { searchEntities, searchJobs } = require('../src/services/torreService');

describe('torreService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
