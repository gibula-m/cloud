import { getConnection } from "typeorm";
import { Feature } from "../entities/feature";
import { Service } from "../entities/service";

export const registerService = async (
  name: string,
  featuresArray: string[]
) => {
  //services
  let service;
  const checkService = await getConnection()
    .getRepository(Service)
    .findOne({ name: name });

  if (checkService === undefined) {
    service = new Service();
    service.name = name;
    await getConnection().getRepository(Service).save(service);
  } else {
    service = checkService;
  }

  //features
  let features;
  const checkFeatures = (
    await getConnection().getRepository(Feature).find({ service: service })
  ).map((elem) => elem.name);

  const toRemove = checkFeatures.filter((x) => !featuresArray.includes(x));
  const newItems = featuresArray.filter((x) => !checkFeatures.includes(x));

  const featureRepository = getConnection().getRepository(Feature);
  for (let item of newItems) {
    await featureRepository.save({ name: item, service: service });
  }
  for (let item of toRemove) {
    const entity = await featureRepository.findOne({
      name: item,
      service: service,
    });
    featureRepository.remove(entity!);
  }
};
