const path = require("path");
const jobsData = require(path.join(__dirname, '..', 'json', 'jobs.json'));

const allJobs = {
  lowLevel: [],
  midLevel: [],
  highLevel: [],
};

let jobsLoaded = false;

function initializeJobs() {
  if (jobsLoaded) return;

  const data = jobsData.Jobs;
  const ensureArray = (input) => (Array.isArray(input) ? input : [input]);

  if (data.LowLevelJobs) allJobs.lowLevel = ensureArray(data.LowLevelJobs);
  if (data.MidLevelJobs) allJobs.midLevel = ensureArray(data.MidLevelJobs);
  if (data.HighLevelJobs) allJobs.highLevel = ensureArray(data.HighLevelJobs);

  const allIds = [
    ...allJobs.lowLevel,
    ...allJobs.midLevel,
    ...allJobs.highLevel,
  ]
    .map((job) => job.Id)
    .filter((id) => Boolean(id));

  const seen = new Set();
  const duplicates = new Set();
  allIds.forEach((id) => {
    if (seen.has(id)) duplicates.add(id);
    else seen.add(id);
  });

  if (duplicates.size) {
    throw new Error(
      `Duplicate Job IDs gefunden: ${[...duplicates].join(", ")}`
    );
  }

  jobsLoaded = true;
}

initializeJobs();

class JobWrapper {
  constructor(job, level = null) {
    this.job = job;
    this.level = level;
  }

  value(property) {
    return this.job ? this.job[property] : undefined;
  }

  getLevel() {
    return this.level;
  }

  getAllProperties() {
    return this.job;
  }
}

const LoadJobs = {
  isLoaded() {
    return jobsLoaded;
  },

  getJobById(jobId) {
    if (!jobsLoaded) {
      console.warn("Jobs wurden noch nicht initialisiert.");
      return new JobWrapper(null);
    }

    let found = allJobs.lowLevel.find((j) => j.Id === jobId);
    if (found) return new JobWrapper(found, "low");

    found = allJobs.midLevel.find((j) => j.Id === jobId);
    if (found) return new JobWrapper(found, "mid");

    found = allJobs.highLevel.find((j) => j.Id === jobId);
    if (found) return new JobWrapper(found, "high");

    return new JobWrapper(null);
  },

  getJobsByLevel(level) {
    if (!jobsLoaded) return [];
    switch (level) {
      case "low":
        return allJobs.lowLevel;
      case "mid":
        return allJobs.midLevel;
      case "high":
        return allJobs.highLevel;
      default:
        return [];
    }
  },
};

module.exports = LoadJobs;
