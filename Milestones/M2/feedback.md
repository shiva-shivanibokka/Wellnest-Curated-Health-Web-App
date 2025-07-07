# Milestone 2 Docs Revision

## General Feedback

- This milestone does not meet expectations.

- I’m applying the class policies as follows:
   - Two major sections are missing: **Scalability Design** and **Ranking, Rating, and Search Algorithms**. Each missing section carries a 10% deduction, totaling a 20% penalty on the final grade. It was supposed to be 20% per missing section, but I’m giving you the chance to do better in the next milestone.
   - ERD: We had a lecture (also recorded) on how to create a proper ERD, with examples. The slides on Canvas also have plenty of references.
   - Following the syllabus policies, this milestone is not eligible for an M2v2 revision or regrade.
   - Final grade for milestone 2 checkpoint 1: **3 out of 7 for all team members.**

- Jacob: one of the responsibilities of the team lead is to ensure all required sections are completed before submission. Moving forward, make sure to review everything and set internal deadlines to avoid situations like this.

## Table of Contents

- The links are not working properly. Please fix them.

## Data Definitions

- I don’t see actual data definitions in this section. You had them clearly stated in M1v2, why did you change them completely? In this milestone, you only listed attribute descriptions, which are not the same. As discussed in class, this section should remain high-level, exploratory, and consistent with earlier milestones.

## Prioritized Functional Requirements

- This section is mostly good, but many of your P3 items are actually P2 or even P1. Please reclassify them. P3 should be reserved for opportunistic functionality. For example, “Users shall be able to login with their social profiles” is listed as P3, but it's more appropriate as a P2.

## Mockups/Storyboards

- These are well done; nice job. That said, for the next milestone (wireframes), make sure everything is consistent. Right now, the design looks like it was done by multiple people with slightly different styles.

## System Design

- Database Architecture:
   - The ERD needs a serious rework.
   - All your entities are marked as strong entities, which doesn’t match how relational databases work.
   - Associative entities are missing, these are critical for implementing many-to-many relationships.
   - Cardinalities are missing from the User entity.
   - Structurally, the ERD places too much responsibility on the User. Everything seems to depend on that one entity, which is not a sound design.
   - Honestly, I’m surprised by these issues, especially since some of you are either in my databases class or have taken it before. This topic was covered in this class (and recorded).

- Backend Architecture:
   - This section is incomplete; the Scalability Design is missing. We spent two full lectures on this topic. See the general feedback for the deductions applied.

- Network and Deployment:
   - This section is good, but you need to expand your coverage of the user's Local Area Network. Right now, you only mention support for laptops. You’re expected to support all types of devices in this course.

## High-Level APIs and Main Algorithms

- The section on search, ranking, and rating algorithms is missing. This is a mandatory section. Without it, I have no way of knowing what your search bar is supposed to do or how to test it in your prototype.

## Next Steps

1. Freeze `m2v1.pdf`, no further edits allowed. This serves as a snapshot to evaluate your progress.
2. No revision approved for M2v2 due to missing required sections, per class policy.
3. Begin working on `m3v1`.
