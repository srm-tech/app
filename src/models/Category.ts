import { ObjectId } from '@/lib/db';
import { Collection } from 'mongodb';

const Category = (collection: Collection<Document>) => ({
  read: async (id: ObjectId) => {
    return collection.findOne({ _id: id });
  },
  search: async ({ query = '' }) => {
    return collection
      ?.aggregate([
        //pipeline array
        {
          $project: {
            search: {
              $concat: ['$category', '/', '$subcategory'],
            },
            category: '$category',
            subCategory: '$subCategory',
          },
        }, //stage1
        {
          $match: {
            $and: [{ search: { $regex: query, $options: 'i' } }],
          },
        }, //stage2
        { $limit: 30 },
      ])
      .toArray();
  },
});

export default Category;
