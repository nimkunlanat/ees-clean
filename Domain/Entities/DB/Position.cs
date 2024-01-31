using System;

namespace Domain.Entities.DB;

    public class Position : EntityBase
    {
        public string PositionCode {get; set;}
        public string PositionNameTh { get; set;}     
        public string PositionNameEn { get; set;}
        public string Description { get; set;}
        public Boolean Active { get; set;}  
        public string LanguageCode { get; set;}
    }

